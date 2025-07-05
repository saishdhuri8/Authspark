import { Router } from "express";
import Project from "../Schemas/ProjectSchema.js";
import bcrypt from "bcryptjs";
import { decodeApiKeys, generateToken, verifyToken } from "../Utils/JWT.js";
import { callAtURL } from "../Utils/API.js";

const projectUser = Router();



projectUser.use(async (req, res, next) => {
    try {

        const { apiKey } = req.body;
        const decoded = decodeApiKeys(apiKey);

        if (!decoded) {
            return res.status(404).json({ message: "Api key missing or invalid" });
        }
        req.auth = decoded;

        if (["/signup", "/login", "/toggle-active-user"].includes(req.path)) {
            return next();
        }
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }


        const projectUserId = verifyToken(token);


        if (!projectUserId) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = projectUserId;
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ message: "Server error in auth middleware" });
    }
});


projectUser.post("/signup", async (req, res) => {
    try {
        const { email, password, metadata } = req.body;
        const { userId, projectId } = req.auth;

        if (!userId || !projectId || !email || !password) {
            return res.status(401).json({ message: "Parameters are missing" });
        }

        const currentProject = await Project.findOne({ _id: projectId, owner: userId });
        if (!currentProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        const userExists = currentProject.users.some((e) => e.email === email);
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);



        const newUser = {
            email,
            password: hash,
            metadata: metadata || {},
            isActive: true
        };
        currentProject.users.push(newUser);
        const savedUser = currentProject.users[currentProject.users.length - 1];

        await currentProject.save();


        const token = generateToken(savedUser._id.toString(), `${currentProject.tokenValidTime}h`);


        const user = {
            id: savedUser.id,
            email: email,
            metadata: metadata || {},
            createdAt: savedUser.createdAt
        };

        if (currentProject.urlForSignup.length > 0) {
            callAtURL(user, currentProject.urlForSignup);
        }

        return res.status(201).json({
            message: "User created successfully",
            token: token,
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});



projectUser.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { userId, projectId } = req.auth;

        if (!userId || !projectId || !email || !password) {
            return res.status(401).json({ message: "Parameters are missing" });
        }

        const currentProject = await Project.findOne({ _id: projectId, owner: userId });
        if (!currentProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        const currentUser = currentProject.users.find((e) => e.email === email);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordCheck = await bcrypt.compare(password, currentUser.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = generateToken(currentUser._id.toString(), `${currentProject.tokenValidTime}h`); // ✅ Use _id, and convert to string if needed

        return res.status(200).json({
            user: {
                email: currentUser.email,
                metadata: currentUser.metadata,
                id: currentUser._id,
                createdAt: currentUser.createdAt
            },
            token: token
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});







projectUser.post("/get-user-info", async (req, res) => {
    try {
        const { userId, projectId } = req.auth;
        const projectUserId = req.user;

        if (!userId || !projectId || !projectUserId) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        const currentProject = await Project.findOne({ _id: projectId, owner: userId });
        if (!currentProject) {
            return res.status(404).json({ message: "Wrong credentials" });
        }


        const currentUser = currentProject.users.find((e) => e._id.toString() === projectUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const user = {
            user: {
                id: currentUser._id,
                email: currentUser.email,
                metadata: currentUser.metadata,
                createdAt: currentUser.createdAt
            }
        };

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error in /get-user-info:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


projectUser.post("/toggle-active-user", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(404).json({ message: "Something is wrong" });
        const projectUserId = verifyToken(token);
        if (!projectUserId) return res.status(404).json({ message: "User not found" });

        const { userId, projectId } = req.auth;
        const { active } = req.body;

        if (!userId || !projectId || !projectUserId || typeof active !== "boolean") {
            return res.status(400).json({ message: "Missing or invalid credentials" });
        }

        const project = await Project.findOneAndUpdate(
            {
                _id: projectId,
                owner: userId,
                "users._id": projectUserId
            },
            {
                $set: {
                    "users.$.isActive": active
                }
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project or user not found" });
        }

        return res.status(200).json({ message: "User active status updated successfully" });
    } catch (err) {
        console.error("Error in /toggle-active-user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

projectUser.post("/update-metadata", async (req, res) => {

    const { userId, projectId } = req.auth || {};
    const projectUserId = req.user;
    const { metadata } = req.body;


    if (!userId || !projectId || !projectUserId || !metadata) {
        return res.status(400).json({ message: "Missing credentials or metadata" });
    }
    try {
        const updated = await Project.findOneAndUpdate(
            {
                _id: projectId,
                owner: userId,
                "users._id": projectUserId
            },
            {
                $set: {
                    "users.$.metadata": metadata
                }
            }
        );

        if (!updated) {
            return res.status(404).json({ message: "Project or user not found" });
        }

        return res.status(200).json({ message: "Metadata updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});






export default projectUser;