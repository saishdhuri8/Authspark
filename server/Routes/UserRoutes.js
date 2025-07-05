import { Router } from "express";
import User from "../Schemas/UserSchema.js";
import bcrypt from "bcryptjs";
import { generateApiKey, generateToken, verifyToken } from "../Utils/JWT.js";
import Project from "../Schemas/ProjectSchema.js";
import mongoose from "mongoose";
import { getMonthlyJoinStats } from "../Utils/Queries.js";

const userRoute = Router();


userRoute.use(async (req, res, next) => {

    if (["/signup", "/login"].includes(req.path)) {
        return next();
    }


    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "User is Unauthorised" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "User is Unauthorised" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "User is Unauthorised" });
    }
});

userRoute.get("/get-user-data", async (req, res) => {

    try {
        const userId = req.user;


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const currentUser = await User.findById(userId).select("-password");
        if (!currentUser) {
            return res.status(404).json({ message: "User not Found" });
        }

        const allProjects = await Project.find({ owner: userId }).select("name") || [];

        return res.status(200).json({
            ...currentUser.toObject(),
            projects: allProjects
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



userRoute.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Something is missing (Invalid credentials)" });
        }

        const alreadyAUser = await User.findOne({ email: email });
        if (alreadyAUser) {
            return res.status(409).json({ message: "User Already Exists" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hash
        });

        const userCreated = await newUser.save();

        if (!userCreated) return res.status(500).json({ message: "Something went wrong on Server side" });

        const token = generateToken(userCreated.id, '2h');

        return res.status(201).json({ ...userCreated.toObject(), token: token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

userRoute.post("/login", async (req, res) => {
    try {
        const { password, email } = req.body;
        const currentUser = await User.findOne({ email: email });
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        const passwordCheck = await bcrypt.compare(password, currentUser.password);
        if (!passwordCheck) return res.status(400).json({ message: "Wrong password" });

        const token = generateToken(currentUser.id, '2h');
        return res.status(200).json({ ...currentUser.toObject(), token: token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

userRoute.post("/create-project", async (req, res) => {
    try {
        const { name, tokenValidTime, urlForSignup } = req.body;
        const userId = req.user;

        if (!userId || !name || !tokenValidTime) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "No user found" });
        }

        const project = new Project({
            owner: userId,
            name,
            tokenValidTime,
            urlForSignup: urlForSignup || ""
        });

        const apiKey = generateApiKey(currentUser.id, project.id);
        project.apiKey = apiKey;
        const projectCreated = await project.save();
        if (!projectCreated) {
            return res.status(500).json({ message: "Something went wrong on server side" });
        }

        const newProject = {
            name: projectCreated.name,
            id: projectCreated.id,
            totalUsers: projectCreated.users.length,
            createdAt: projectCreated.createdAt,
            apiKey: projectCreated.apiKey
        }

        return res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


userRoute.post("/get-project-info", async (req, res) => {
    try {
        const userId = req.user;
        const { projectId } = req.body;

        if (!userId || !projectId) {
            return res.status(400).json({ message: "Missing projectId or userId" });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid projectId" });
        }

        const currentProject = await Project.findById(projectId);
        if (!currentProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (currentProject.owner.toString() !== userId) {
            return res.status(403).json({ message: "Access denied: Not project owner" });
        }




        const x = {
            name: currentProject.name,
            createdAt: currentProject.createdAt,
            pages: Math.ceil(currentProject.users.length / 7),
            totalUsers: currentProject.users.length,
            apiKey: currentProject.apiKey,
            tokenValidTime: currentProject.tokenValidTime,
            urlForSignup: currentProject.urlForSignup,
        }

        return res.status(200).json(x);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


userRoute.post("/get-users-of-project", async (req, res) => {
    try {
        const userId = req.user;
        const { page = 0, projectId } = req.body;

        if (!userId || !projectId) {
            return res.status(400).json({ message: "Missing userId or projectId" });
        }

        const currentProject = await Project.findOne({ _id: projectId, owner: userId }).select("users");

        if (!currentProject) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        let activeUsers = 0;
        currentProject.users.forEach((e) => {
            if (e.isActive) {
                activeUsers++;
            }
        })

        const users = [];
        const start = 7 * page;
        const end = Math.min(currentProject.users.length, 7 * page + 7);

        for (let i = start; i < end; i++) {
            users.push(currentProject.users[i]);
        }

        return res.status(200).json({ users: users, activeUsers: activeUsers,totalUsers:currentProject.users.length });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


userRoute.post("/delete-user-from-project", async (req, res) => {
    try {
        const { projectId, email } = req.body;
        const userId = req.user;
    
        
        if (!userId || !email || !projectId) {
            return res.status(403).json({ message: "Something is missing" });
        }

        const projectUpdated = await Project.findOneAndUpdate(
            {
                _id: projectId,
                owner: userId
            },
            {
                $pull: {
                    users: { email: email }
                }
            },
           
        );

        if (!projectUpdated) {
            return res.status(404).json({ message: "Project or user not found" });
        }

        return res.status(200).json({ message: "User removed successfully", project: projectUpdated });
    } catch (err) {
        console.error("Error in /delete-user-from-project:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


userRoute.post("/get-all-projects", async (req, res) => {
    try {
        const userId = req.user;

        const projects = await Project.find({ owner: userId })
            .select("name users createdAt")
            .lean();


        const result = projects.map(project => ({
            id: project._id,
            name: project.name,
            totalUsers: project.users.length,
            createdAt: project.createdAt
        }));

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});


userRoute.post("/update-project", async (req, res) => {
    try {
        const userId = req.user;
        const { projectId, tokenValidTime, urlForSignup } = req.body;

        if (!projectId || !userId) {
            return res.status(400).json({ message: "Missing projectId or userId" });
        }

        const updated = await Project.findOneAndUpdate(
            { _id: projectId, owner: userId },
            {
                $set: {
                    tokenValidTime: tokenValidTime ?? 1,
                    urlForSignup: urlForSignup ?? "",
                },
            }
        );

        if (!updated) {
            return res.status(200).json({ success: false });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false });
    }
});



userRoute.post("/get-users-stats", async (req, res) => {
    try {
        const userId = req.user;
        const { projectId, year } = req.body;
        if (!projectId || !userId) {
            return res.status(400).json({ message: "Missing projectId or userId" });
        }
        const data = await getMonthlyJoinStats(projectId, year);
        if (!data) {
            return res.status(500).json({ message: "Something went wrong" });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
})




export default userRoute;
