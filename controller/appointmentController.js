import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";


export const postAppointment = catchAsyncErrors(async (req, res, next) =>{
    console.log("Request Body:", req.body); // Debug log to inspect incoming data

    // const {
    //     firstName,
    //     lastName,
    //     email,
    //     phone,
    //     nic,
    //     dob,
    //     gender,
    //     appointment_date,
    //     doctor:{
    //       firstName:doctor_firstName,
    //       lastName:doctor_lastName,
    //     },
    //     hasVisited,
    //     address,
    //     service,
    // }=req.body;
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      doctorFirstName,
      doctorLastName,
      hasVisited,
      address,
      service,
  }=req.body;

  const doctor = {
    firstName:doctorFirstName,
    lastName:doctorLastName,
  }

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !doctor?.firstName ||
        !doctor?.lastName ||
        !address ||
        !service
      ) {
        return next(new ErrorHandler("Please fill the complete form!", 400));
      }
    const isConflict = await User.find({
      firstName: doctorFirstName,
      lastName: doctorLastName,
      role: "Doctor",
      doctorDepartment: service,
    });
    if (isConflict.length === 0) {
      return next(new ErrorHandler("Doctor not found", 404));
    }
    if (isConflict.length > 1) {
      return next(
        new ErrorHandler(
          "Doctors Conflict! Please Contact Through Email Or Phone!",
          400
        )
      );
    }
    const doctorId= isConflict[0]._id;
    const patientId=req.user._id;
    const appointment=await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        doctor,
        hasVisited,
        address,
        doctorId,
        patientId,
        service,
    });
    res.status(200).json({
        success: true,
        appointment,
        message: "Appointment Send!",
    });
})
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});