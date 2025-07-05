import axios from 'axios';


const authApi = axios.create({
    baseURL: "https://authspark-kg5d.vercel.app/user"
})

authApi.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req;
})

export const loginUser = async (email, password) => {
    try {
        const obj = {
            email: email,
            password: password
        };
        const response = await authApi.post("/login", obj);
        return response.data;
    } catch (error) {
        return false;
    }
}

export const signupUser = async (obj) => {
    try {
        const response = await authApi.post("/signup", obj);
        return response.data;
    } catch (error) {
        return false;
    }
}

export const getUserData = async () => {
    try {
        const response = await authApi.get("/get-user-data");
        return response.data;
    } catch (error) {

        return false;
    }
}

export const getProjects = async () => {
    try {
        const response = await authApi.post("/get-all-projects");
        return response.data
    } catch (error) {
        return false
    }
}

export const createProject = async (obj) => {
    try {
        const response = await authApi.post("/create-project", obj);
        return response.data;
    } catch (error) {
        return false;
    }
}

export const getProjectInfo = async (projectId) => {
    try {
        const response = await authApi.post("/get-project-info", { projectId: projectId });
        return response.data;
    } catch (error) {
        return false;
    }
}

export const getUsers = async (projectId, page) => {
    try {
        const response = await authApi.post("/get-users-of-project", { projectId: projectId, page: page })
        return response.data
    } catch (error) {
        return false;
    }
}

export const updateProject = async (projectId, tokenValidTime, urlForSignup) => {
    try {
        const response = await authApi.post("/update-project", { projectId: projectId, tokenValidTime: tokenValidTime, urlForSignup: urlForSignup });
        return true;
    } catch (error) {
        return false;
    }
}

export const getMonthlyUsers = async (projectId, year) => {
    try {
        const response = await authApi.post("/get-users-stats", { projectId: projectId, year: year });
        return response.data;
    } catch (error) {
        return false;
    }
}

export const deleteUserOfProject = async (projectId, email) => {
    try {
        const response=await authApi.post("/delete-user-from-project",{projectId:projectId,email:email});
        return true;
    } catch (error) {
        return false;
    }
}
