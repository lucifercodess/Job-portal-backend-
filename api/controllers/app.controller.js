import App from "../models/app.model.js"
import cloudinary from 'cloudinary';
import Job from "../models/job.model.js";
export const EmployergetAllApplications = async(req,res) =>{
  
  try {
    if(req.user.role == "Job Seeker"){
      return res.status(403).json({ code: 0, message: "Only Employers can access this " });
    }
    const apps = await App.find({'employer_id.user': req.user._id});
    res.status(200).json({ code: 1, data: apps });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "server error" });
  }
}
export const SeekergetAllApplications = async(req,res) =>{
  
  try {
    if(req.user.role == "Employer"){
      return res.status(403).json({ code: 0, message: "Only Job Seekers can apply for jobs" });
    }
    const apps = await App.find({'applicant_id.user': req.user._id});
    res.status(200).json({ code: 1, data: apps });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "server error" });
  }
}
export const postApp = async(req,res)=>{
  const userId = req.user.id;
  try {
    if(req.user.role == "Employer"){
      return res.status(403).json({ code: 0, message: "Only Job Seekers can apply for jobs" });
    }

    if(!req.files || Object.keys(req.files).length === 0){
      return res.status(400).json({ code: 0, message: "No file uploaded" });
    }

    const { resume } = req.files;
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg','image/webp'];

    if (!allowedFormats.includes(resume.mimetype)){
      return res.status(400).json({ code: 0, message: "Invalid file format. Only PNG, JPEG, JPG, and WebP are allowed" });
    }

    const cloudRes = await cloudinary.uploader.upload(
      resume.tempFilePath
    );

    if(!cloudRes || cloudRes.error){
      return res.status(400).json({ code: 0, message: "Error while uploading resume" });
    }

    // Debugging logs
    console.log("Request body:", req.body);

    const { name, email, phone, coverLetter, address, jobId } = req.body;

    // Debugging logs
    console.log("Received fields:", { name, email, phone, coverLetter, address, jobId });
    if (!req.body.coverLetter) {
      console.log('coverLetter is missing or empty');
  }
    if(!name || !email || !phone || !coverLetter || !address || !jobId){
      return res.status(400).json({ code: 0, message: "All fields are required" });
    }

    const job = await Job.findById(jobId);

    if(!job){
      return res.status(404).json({ code: 0, message: "Job not found" });
    }

    const applicant_id = {
      user: req.user._id,
      role: "Job Seeker"
    };

    const employer_id = {
      user: job.postedBy,
      role: "Employer"
    };

    const newApp = new App({
      resume: {
        public_id: cloudRes.public_id,
        url: cloudRes.secure_url,
      },
      name,
      email,
      phone,
      coverLetter,
      address,
      jobId,
      applicant_id: applicant_id,
      employer_id: employer_id                   
    });

    await newApp.save();

    return res.status(201).json({code: 1, message: "application sent",data: newApp});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Server Error while sending application" });
  }
}


export const deleteApp = async(req,res)=>{
  const {id} = req.params;
  const seekerId = req.user._id;
  try {
    if(role === 'Employer'){
      return res.status(403).json({ code: 0, message: "Only Job Seekers can delete their applications" });
    }
    let app = await App.findById(id);
    if(!app){
      return res.status(404).json({ code: 0, message: "Application not found" });
    }
    if(String(app.applicant_id.user) !== String(id)){
      return res.status(403).json({ code: 0, message: "You are not authorized to delete this application" });
    }
    app = await App.findByIdAndDelete(id);
    return res.status(200).json({ code:0, message: "Application deleted"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Server Error while deleting application" });
  }
}

