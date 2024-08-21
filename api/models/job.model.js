import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: [
      'Backend Developer', 
      'Frontend Developer', 
      'Full Stack Developer', 
      'Software Engineer', 
      'Sr Software Engineer', 
      'DevOps Engineer', 
      'Mobile App Developer', 
      'Data Scientist', 
      'Machine Learning Engineer', 
      'UI/UX Designer', 
      'QA Engineer', 
      'System Architect', 
      'Product Manager', 
      'Project Manager', 
      'Business Analyst', 
      'Technical Support Specialist', 
      'Network Administrator', 
      'Database Administrator', 
      'Cybersecurity Analyst', 
      'IT Consultant'
    ]
  }
  ,
  description:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true,
    enum: ['Full-Time', 'Part-Time', 'Contract']
  },
  country:{
    type:String,
    required:true
  },
  salary:{
    type:String,
    // required:true
  },
  city:{
    type:String,
    required:true
  },
  exactLocation:{
    type:String,
    required:true
  }
  ,
  salaryFrom:{
    type:String,
    // required:true
  }
  ,salaryTo:{
    type:String,
    // required:true
  }
  ,expired:{
    type:Boolean,
    required:true
  },
  jobPostedOn:{
    type:Date,
    default: Date.now
  },
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{timestamps: true});


const Job = mongoose.model("Job",jobSchema);
export default Job;