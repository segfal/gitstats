const express = require("express");
const router = express.Router();

const { User_Info } = require("../db/models");

router.get("/", async (req, res, next) => {
    try {
      const allUsers = await User_Info.findAll();
      allUsers
        ? res.status(200).json(allUsers)
        : res.status(404).json("No users found"); 
    } catch (error) {
      next(error);
    }
  });
  

  router.post("/", async (req, res, next) => {
    try {
      const newUser = await User_Info.create({
        username: req.body.name,
        repo_name: req.body.address,
        date_created: req.body.date_created,
        description: req.body.description,
        last_updated: req.body.last_updated,
        total_commits: req.body.total_commits,
        repo_description: req.body.repo_description,
        responsiveness: req.body.responsiveness,
        pr_integration_time: req.body.pr_integration_time,
        unreviewed_prs: req.body.unreviewed_prs,
        time_to_merge: req.body.time_to_merge,
        follow_on_commits: req.body.follow_on_commits,
        rework: req.body.rework,
        impact: req.body.impact,
      });
      newUser
        ? res.status(200).json(newUser)
        : res.status(404).json("No info provided");
    } catch (error) {
      next(error);
    }
  });



module.exports = router;