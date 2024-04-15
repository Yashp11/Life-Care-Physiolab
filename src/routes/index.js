
import { Router } from "express";
const router = Router();

import { randomBytes } from 'crypto';
import cookieParser from "cookie-parser";

// DATABASE
import connectDB from '../db/db.js';

// MODELS
import User from '../../src/models/user_model.js';
import Doctor from '../../src/models/doctor_model.js';
import Appointment from '../../src/models/apoointment_model.js';

// MIDDLEWARES
import authentication from '../middleware/authentication.js';
import userauthentication from '../middleware/userauthentication.js';
import usertype from "../middleware/usertype.js";
import isuserlogin from './../middleware/isuserlogin.js';


connectDB();

router.use(cookieParser());

function genertesessionID() {
    const buffer = randomBytes(16);
    const sessionID = buffer.toString('hex');
    return sessionID;
}

// Home
router.get("/", (req, res) => {
    res.render("home");
});
router.get("/home", (req, res) => {
    res.render("home");
});


// Admin Dashbord
router.get("/admin", async (req, res) => {
    try {
        const doctorsCount = await Doctor.countDocuments();
        const patientsCount = await User.countDocuments();
        const appointmentsCount = await Appointment.countDocuments();
        const visitedCount = await Appointment.countDocuments({ status: "Visited" });
        const cancelledCount = await Appointment.countDocuments({ status: "Cancelled" });
        const scheduledCount = await Appointment.countDocuments({ status: "Scheduled" });

        res.render("admin", {
            number_of_doctors: doctorsCount,
            number_of_patients: patientsCount,
            number_of_appointments: appointmentsCount,
            visited_appointments: visitedCount,
            cancelled_appointments: cancelledCount,
            scheduled_appointments: scheduledCount,
        });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Admin Appointments
router.get("/admin/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('user_id');
        res.render('./../src/components/admin_appointment', {
            appointments: appointments,
        });
    } catch (error) {
        console.log(error);
    }
});

// Admin Doctor
router.get('/admin/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('./../src/components/admin_doctor', {
            doctors: doctors,
        });
    } catch (error) {
        console.log(error);
    }
});

// Admin Patient
router.get('/admin/patients', async (req, res) => {
    try {
        const patients = await User.find();
        res.render('./../src/components/admin_patient', {
            patients: patients,
        });
    } catch (error) {
        console.log(error);
    }
});

// Admin Delete Data
router.get("/fetchData", async (req, res) => {
    let type = req.query.type;
    if (type === "doctor") {
        try {
            await Doctor.deleteOne({ _id: req.query.id });
            console.log("Doctor Deleted");
            res.redirect("/admin#doctors");
        } catch (error) {
            console.log(error);
        }
    } else if (type === "patient") {
        try {
            await User.deleteOne({ _id: req.query.id });
            console.log("Patient Deleted");
            res.redirect("/admin#patients");
        } catch (error) {
            console.log(error);
        }
    }
    else {
        try {
            await Appointment.deleteOne({ _id: req.query.id });
            console.log("Appointment Deleted");
            res.redirect("/admin#appointments");
        } catch (error) {
            console.log(error);
        }
    }
});

//Admin Update data
router.get("/updatedata", async (req, res) => {
    try {
        let appo_update = await Appointment.updateOne({ _id: req.query.id }, { $set: { status: req.query.status } });
        if (req.query.status !== "Scheduled") {
            appo_update = await Appointment.updateOne({ _id: req.query.id }, { $set: { doctor_status: "Available" } });
        } else {
            appo_update = await Appointment.updateOne({ _id: req.query.id }, { $set: { doctor_status: "Not-Available" } });
        }
        res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
});



// Dashbord
router.get("/dashbord", usertype, (req, res) => {
    res.render("dashbord", {
        isvalidrole: req.type,
        user: req.user,
        message: "Login Successfully"
    });
});

router.get("/appointmentData", async (req, res) => {
    const type = req.query.type;
    const id = req.query.id;

    let doctor = await Doctor.findOne({ _id: id });
    if (type == 'doctor') {
        const appointment = (await Appointment.find({ doctor_name: doctor.name })).map(appointment => appointment);
        res.json(appointment);
    } else {
        const appointment = (await Appointment.find({ user_id: id })).map(appointment => appointment);
        res.json(appointment);
    }
});

// Update status
router.get("/updatestatus", async (req, res) => {
    const id = req.query.id;
    const status = req.query.status;
    try {
        let appointent = await Appointment.updateOne({ _id: id }, { $set: { status: status, doctor_status: "Available" } });
        console.log("Appointment Cancelled");
        res.redirect("/dashbord");
    } catch (error) {
        console.log(error);
    }
});


// Book Appointment
router.get("/booking", isuserlogin, (req, res) => {
    res.render("booking");
});

router.post("/book", async (req, res) => {
    let new_Apoointment = new Appointment({
        user_id: req.session.user.user_id.toString(),
        name: req.body.name,
        contact: req.body.phone,
        date: req.body.date,
        time: req.body.timezone,
        doctor_name: req.body.doctor
    });
    try {
        const appointment = await new_Apoointment.save();
        console.log("Apoointment Booked");
        res.redirect('/dashbord');
    } catch (error) {
        console.log(error);
    }
});

router.get('/available-doctors', async (req, res) => {
    try {
        const date = req.query.date;
        const time = req.query.time;
        const doctors = await Doctor.find();
        const required_doctors = await Appointment.find({ date: date, time: time, doctor_status: "Not-Available" });
        
        const doctor_name = doctors.map(doctors => doctors.name);
        const requiredDoctors = required_doctors.map(appointment => appointment.doctor_name);
        const available_doctors = doctor_name.filter(doctor => !requiredDoctors.includes(doctor));

        res.json(available_doctors);
    } catch (error) {
        console.log(error);
    }
});


// service
router.get("/service", (req, res) => {
    res.render("service");
});


// contact
router.get("/contact", (req, res) => {
    res.render("contact");
});


// About US
router.get("/about", (req, res) => {
    res.render("about");
});


// signup Page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Doctor Signup
router.post("/doctor-signup", userauthentication, async (req, res) => {
    let newUser = new Doctor({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        spciality: req.body.specility,
        experience: req.body.experience,
        password: req.body.conform_password
    });
    try {
        const user = await newUser.save();
        console.log("Doctor DataSaved Successfully");
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});

// Patient Signup
router.post("/patient-signup", userauthentication, async (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        gender: req.body.gender,
        age: req.body.age,
        password: req.body.conform_password
    });
    try {
        const user = await newUser.save();
        console.log("Patient DataSaved Successfully");
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});


// Login
router.get("/login", (req, res) => {
    if (req.cookies.sessionID) {
        res.redirect("dashbord");
    }else{
        res.render("login");
    }
});
router.post('/logindata', authentication, (req, res) => {
    if (req.login) {
        const sessionId = genertesessionID();
        res.cookie('sessionID', sessionId);
        req.session.user = {
            user_id: req.user._id.toString(),
            email: req.user.email
        }
        if (req.user.email === 'admin@gmail.com') {
            console.log("Admin Login Successfully");
            res.redirect('/admin');
        }
        else {
            console.log("Login Successfully");
            res.redirect('/dashbord');
        }
    } else {
        res.redirect('/login');
    }
});
// LogIn Validation
router.get('/loginvalidation', (req, res) => {
    res.render("loginvalidation");
})

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    });
    res.clearCookie('sessionID');
});

export default router;