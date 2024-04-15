import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    spciality: String,
    experience: Number,
    password: String,
});

const Doctor = mongoose.model("doctor", doctorSchema);

export default Doctor;
