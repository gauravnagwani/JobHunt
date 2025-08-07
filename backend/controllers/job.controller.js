import { Job } from "../models/job.model.js";

//admin controller for job posting
export const postJob = async(req, res) => {
    try {
        const{title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id; //logged in user id
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New Job posted successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.log(error);
    }
}
//user controller for job search
//this will return all jobs that match the keyword in title or description
export const getAllJobs = async(req,res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }            
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company",
        }).sort({ createdAt: -1 });
        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        };
        return res.status(200).json({
            message: "Jobs fetched successfully.",
            success: true,
            jobs
        });
    } catch (error) {
        console.log(error);
    }
}
//user controller for job details
//this will return the job details by id
export const getJobById = async(req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Job fetched successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.log(error);
    }
}

//admin controller for getting all jobs
//this will return all jobs posted by the admin
export const getAdminJobs = async(req, res) => {
    try {
        const adminId = req.id; //logged in admin id
        const jobs = await Job.find({ created_by: adminId });
        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Jobs fetched successfully.",
            success: true,
            jobs
        });
    } catch (error) {
        console.log(error);
    }
}