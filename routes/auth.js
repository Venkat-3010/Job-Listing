const express = require('express');
const app = express.Router();
const jobController = require('../controller/job');
const verifyToken = require('../middlewares/verifyAuth');

router.post("/create", verifyToken, jobController.createJobPost);
router.get("/job-detals/:jobId/:userId", jobController.getJobDetalsById);
router.put("/update/:jobId", verifyToken, jobController.updateJobDetalsById);
router.get("/all/:userId", jobController.getAlljobs);

module.exports = router;