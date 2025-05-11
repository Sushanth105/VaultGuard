import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    url : { type: String, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true },
    userId : { type: String, required: true },
});

export const Data = mongoose.models?.Data || mongoose.model("Data", dataSchema);