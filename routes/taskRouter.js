const express = require("express");
const tasksController = require("../controllers/taskController");
const router = express.Router();

//Routes

router.get("/", tasksController.getTasks);
router.get("/:id", tasksController.getOneTask);
router.get("/date/:date", tasksController.getTasksOfTheDate);
router.post("/", tasksController.addTask);
router.delete("/:id", tasksController.deleteTask);
router.patch("/:id", tasksController.changeTask);
router.patch("/complete/:id", tasksController.completeTask);

module.exports = router;
