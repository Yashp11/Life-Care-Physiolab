

import User from "../models/user_model.js";
import Doctor from "../models/doctor_model.js";

const authentication = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    req.login = false;
    const user = await User.findOne({ email: username });
    const doctor = await Doctor.findOne({ email: username });
    if (!username || !password) {
        return res.send('<script>alert("Enter Username And Password");window.location.href="/login";</script>');
    } else {
        if (!user && !doctor) {
            return res.send('<script>alert("User Not Found"); window.location.href="/login";</script>');
        } else {
            if (user && user.password === password) {
                req.login = true;
                req.user = user;
            } else if (doctor && doctor.password === password) {
                req.user = doctor;
                req.login = true;
            } else {
               return  res.send('<script>alert("Incorrect Password"); window.location.href="/login";</script>');
            }
        }
    }
    next();
};


export default authentication;
