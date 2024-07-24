const Job = require('../models/job');

const createJobPost = async (req, res) => {
    try{
        const currentUserId = req.currentUserId;
        const {
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            duration,
            locationType,
            skills,
            jobType,
            information,
        } = req.body;

        if(
            !companyName ||
            !logoUrl ||
            !title ||
            !description ||
            !salary ||
            !location ||
            !duration ||
            !locationType ||
            !skills ||
            !jobType ||
            !information
        ){
            return res.status(400).json({
                message: 'Please fill all the fields'
            });
        }

        const jobDetails = new Job({
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            duration,
            locationType,
            skills,
            jobType,
            information,
            refUserId: currentUserId
        });

        await jobDetails.save();
        res.json({ message: 'Job created successfully'});
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getJobDetailsById = async (req, res) => {
    try{
        const { jobId, userId } = req.params;

        if(!jobId){
            return res.status(400).json({
                message: 'Please provide jobId'
            });
        }
            const jobDetails = await Job.findById(jobId);

            if(!jobDetails) {
                return res.status(404).json({
                    message: 'Job not found'
                });
            }
            let isEditable = false;

            if(jobDetails.refUserId.toString() === userId){
                isEditable = true;
            }

            res.json({jobDetails, isEditable: isEditable});
            }catch(err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
    }
};

const updateJobDetailsById = async (req, res) => {
    try{
        const JobId = req.params.jobId;
        const {
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            duration,
            locationType,
            skills,
            jobType,
            information,
        } = req.body;

        if(
            !companyName ||
            !logoUrl ||
            !title ||
            !description ||
            !salary ||
            !location ||
            !duration ||
            !locationType ||
            !skills ||
            !jobType ||
            !information
        ){
            return res.status(400).json({
                message: 'Please fill all the fields'
            });
        }

        if (!jobId){
            return res.status(400).json({
                message: 'Please provide jobId'
            });
        }

        const isJobExists = await Job.findOne({ _id: jobId});

        if(!isJobExists) {
            return res.status(404).json({
                message: 'Job not found'
            });
        }

        await Job.updateOne({ _id: jobId},
            {
                $set: {
                    companyName,
                    logoUrl,
                    title,
                    description,
                    salary,
                    location,
                    duration,
                    locationType,
                    skills,
                    jobType,
                    information,
                },
            }
        );
        res.json({ message: 'Job updated successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAlljobsfilter = async (req, res) => {
    try{
        const searchQuery = req.query.searchQuery || "";
        const skills = req.query.skills;
        let filteredSkills;
        let filter = {};
        if(skills && skills.length > 0){
            filteredSkills = skills.split(",");
            const caseInsensitiveFilteredSkills = filteredSkills.map(
                (element) => new RegExp(element, "i")
            );
            filteredSkills = caseInsensitiveFilteredSkills;
            filter = {
                skills: {
                    $in: filteredSkills
                }
            }
        }

        const jobList = await Job.find({
            title: {  $regex: searchQuery, $options: 'i' },
            ...filter,
        });
        res.json({data: jobList});
    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAlljobs = async (req, res) => {
    try{
        const jobList = await Job.find({});
        res.json({data: jobList});
    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createJobPost,
    getJobDetailsById,
    updateJobDetailsById,
    getAlljobs,
    getAlljobsfilter,
};