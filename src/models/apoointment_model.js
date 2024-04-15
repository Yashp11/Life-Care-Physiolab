
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    date: Date,
    time: String,
    doctor_name: String,
    doctor_status: {
        type: String,
        enum: ['Available', 'Not-Available'],
        default: 'Not-Available'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Visited', 'Cancelled'],
        default: 'Scheduled'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
});

const Appointments = mongoose.model("appointments", appointmentSchema);

export default Appointments;
