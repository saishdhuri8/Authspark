import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import connectDB from './Configs/mongoConnect.js'
import userRoute from './Routes/UserRoutes.js'
import projectUser from './Routes/ProjectUserRoutes.js'
import cors from "cors"
const app = express()
const port = 3000

connectDB()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], 
    allowedHeaders: ["Content-Type", "Authorization"] 
}));


app.use(express.json());
app.use("/user",userRoute);
app.use("/project-users",projectUser);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})