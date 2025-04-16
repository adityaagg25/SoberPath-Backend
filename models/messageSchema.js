import mongoose from "mongoose";
import validator from "validator";

const messageSchema=new mongoose.Schema({
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
    message:{
        type: String,
        required: true,
        minLength: [10, "message must contain atleast 10 characters"]
    }
});

export const Message=mongoose.model("Message",messageSchema);