import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First Name must contain atleast 3 characters"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last Name must contain atleast 3 characters"]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "please provide a valid email"]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10, "phone no must contain exact 10 letters"],
        maxLength: [10, "phone no must contain exact 10 letters"]
    },
    nic:{
        type: String,
        required: true,
        minLength: [13, "nic must contain exact 13 letters"],
        maxLength: [13, "nic must contain exact 13 letters"]
    },
    dob: {
        type: String,
        required: [true, "DOB is required"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male","Female"]
    },
    appointment_date:{
        type: String,
        required: true,
    },
    service:{
        type: String,
        required: true,
    },
    doctor:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        }
    },
    hasVisited:{
        type: Boolean,
        default: false
    },
    doctorId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    patientId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    address:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum:["Pending","Accepted","Rejected"],
        default: "Pending",
    }
});

export const Appointment=mongoose.model("Appointment",appointmentSchema);