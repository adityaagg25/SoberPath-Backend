import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtTokens.js";
import cloudinary from "cloudinary";

export const patientRegister= catchAsyncErrors(async(req,res,next)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role
    }=req.body;
    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role 
    ){
        return next(new ErrorHandler("please full the form completely",400));
    }
    let user=await User.findOne({email});
    if(user){
        return next(new ErrorHandler("user already registered",400));
    }
    user=await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role
    });
    generateToken(user,"user registered!",200,res);
 });

 export const login =catchAsyncErrors(async(req,res,next)=>{
    const {email,password,confirmPassword,role}=req.body;
    if(!email||!password||!confirmPassword||!role){
        return next(new ErrorHandler("please provide all details!",400))
    }
    if(password!==confirmPassword){
        return next(new ErrorHandler("password and confirm password do not match!",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid password or email",400));
    }
    const isPasswordMatched =await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password or email",400));
    }
    if(role!==user.role){
        return next(new ErrorHandler("user with this role Not found",400));
    }
    generateToken(user,"user logged in successfully!",200,res);
 })
 export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic
    }=req.body;
    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic 
    ){
        return next(new ErrorHandler("please full the form completely",400));
    }
    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exits`));
    }
    const admin=await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role:"Admin"
    });
    res.status(200).json({
        success: true,
        message: "new admin registered!"
    });
 })

 export const getAllDoctors= catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role: "Doctor"});
        res.status(200).json({
        success: true,
        doctors
    });
 });

 export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success: true,
        user
    });
 })

 export const logoutAdmin=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    .json({
        success: true,
        message:"Admin logged out successfully!"
    });
 });

 export const logoutPatient=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    .json({
        success: true,
        message:"Patient logged out successfully!"
    });
 })

 export const addNewDoctor=catchAsyncErrors(async (req,res,next)=>{
    if(!req.files||Object.keys(req.files).lrngth===0){
        return next(new ErrorHandler("Doctor Avatar Required!",400));
    }
    const {docAvatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File format not supported!",400));
    }
    const {firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment
    }=req.body;
    if(!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !docAvatar||
        !doctorDepartment){
            return next(new ErrorHandler("please provide complete details",400));
        }
        const isRegistered=await User.findOne({email});
        if(isRegistered){
            return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));
        }
        const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
        if(!cloudinaryResponse||cloudinaryResponse.error){
            console.error("Cloudinary Error:", cloudinaryResponse.error ||"Unknown Cloudinary Error");
            return next(
                new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
              );
        }
        const doctor=await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
        });
        res.status(200).json({
            success:true,
            message: "New Doctor Registered!",
            doctor
        })
})

export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "patient" });
  res.status(200).json({
    success: true,
    patients,
  });
});

export const registerPatient = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;

  const existingPatient = await User.findOne({ email });
  if (existingPatient) {
    return next(new ErrorHandler("Patient already exists", 400));
  }

  const patient = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "patient",
  });

  res.status(201).json({
    success: true,
    message: "Patient registered successfully",
    patient,
  });
});

// Example of updating doctorDepartment to service
const updateUser = async (req, res) => {
  try {
    const { name, email, service } = req.body; // Replace doctorDepartment with service
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, doctorService: service }, // Update field name
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};