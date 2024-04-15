// const mongoose = require('mongoose')
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    gender: String,
    age: Number,
    password: String,
});

const User = mongoose.model("user", userSchema);

export default User;
