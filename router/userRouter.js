import express from "express";
import {addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login,logoutAdmin,logoutPatient,patientRegister, getAllPatients, registerPatient} from "../controller/userController.js";
import {isAdminAuthenticated, isPatientAuthenticated}from "../middlewares/auth.js"


const router=express.Router();

router.post("/patient/register", isAdminAuthenticated, registerPatient); // New route for registering patients
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated ,addNewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/patient/me",isPatientAuthenticated,getUserDetails);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/patient/logout",isPatientAuthenticated,logoutPatient);
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);
router.get("/patients", isAdminAuthenticated, getAllPatients); // New route for fetching patients

export default router;