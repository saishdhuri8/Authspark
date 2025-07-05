import mongoose from "mongoose";

const projectUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    
    isActive: {
        type: Boolean
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    apiKey:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    tokenValidTime: {
        type: Number,
        default: 1
    },
    urlForSignup: {
        type: String,
        default: ""
    },
    users: [projectUserSchema]

}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
