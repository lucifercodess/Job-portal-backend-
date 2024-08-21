import Job from "../models/job.model.js";

export const getAllJobs = async(req,res)=>{
  try {
    const jobs = await Job.find({expired: false});
    res.status(200).json({ code: 1, data: jobs });
  } catch (error) {
    res.status(500).json({ code: 0, message: error.message });
  }
}

export const postJob = async(req,res)=>{
  const posterId = req.user._id;
  const role = req.user.role;
  try {
    const {title,description,category,salary,country,city,exactLocation,salaryFrom,salaryTo,expired} = req.body;
    if(role === 'Job Seeker'){
      return res.status(403).json({ code: 0, message: 'Only Employers can post jobs' });
    }
  if(!title || !description || !category || !country || !city || !exactLocation|| !expired){
    return res.status(400).json({ code: 0, message: 'All fields are required' });
  }
  if( (!salaryFrom || !salaryTo) && !salary){
    return res.status(400).json({ code:0,message: "Either provide a salary range or provide a fixed salary"});
  }
  if(salaryFrom &&salaryTo && salary){
    return res.status(400).json({ code: 0, message: 'Provide either a salary range or a fixed salary' });
  }
  if (description.length < 20 || description.length > 100){
    return res.status(400).json({ code: 0, message: 'Description should be between 20 and 100 characters' });
  }
  const newJob = new Job({
    title,
    description,
    category,
    salary,
    country,
    city,
    exactLocation,
    salaryFrom,
    salaryTo,
    expired,
    postedBy: posterId
  })
  await newJob.save();
  res.status(201).json({ code: 1, message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 0, message: 'Server Error while posting job' });
  }
}

export const getMyJobs = async(req,res)=>{
  const id = req.user;
  const role = req.user.role;
  try {
    if(role === 'Job Seeker'){
      return res.status(403).json({ code: 0, message: 'Only Employers can post jobs' });
    }
    const myjobs = await Job.find({postedBy: id},{expired:false});
    return res.status(200).json({ code: 1,myJobs : myjobs});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: 'Server Error while getting my jobs' });
  }
}

export const updateJobField  = async(req,res)=>{
  const {id} = req.params;

  let searchJob = await Job.findById(id);
  try {
    if(req.user.role === 'Job Seeker'){
      return res.status(403).json({ code: 0, message: 'Only Employers can update jobs' });
    }
    if(!searchJob){
      return res.status(404).json({ code: 0, message: 'Job not found' });
    }
    if (String(searchJob.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ code: 0, message: 'You are not authorized to delete this job' });
    }
    searchJob = await Job.findByIdAndUpdate(id,req.body,{
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
    await searchJob.save();
    return res.status(200).json({code:1,message: "job updated successfully ",job:searchJob})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: 'Server Error while updating job' });
  }
}

export const deleteJob = async(req,res)=>{
  const {id} = req.params;
  try{
    if(req.user.role === 'Job Seeker'){
      return res.status(403).json({ code: 0, message: 'Only Employers can delete jobs' });
    }
    let job = await Job.findById(id);
    if(!job){
      return res.status(404).json({ code: 0, message: 'Job not found' });
    }
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ code: 0, message: 'You are not authorized to delete this job' });
    }
    job = await Job.findByIdAndDelete(id);
    return res.status(200).json({ code: 1, message: 'Job deleted successfully' });
  }catch(e){
    console.log(e);
    return res.status(500).json({ code: 0, message: 'Server Error while deleting job' });
  }
}