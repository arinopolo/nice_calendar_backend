const Task = require("../models/taskModel");

const tasksController = {
  //obtener la informacion de todas las tareas
  getTasks: async (req, res, next) => {
    try {
      const tasksList = await Task.find();
      res.json(tasksList);
    } catch (error) {
      console.error("Error al acceder a las tareas:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  //obtener la informacion de una sola tarea por su id
  getOneTask: async (req, res, next) => {
    try {
      const taskToBeConsulted = req.params.id;
      const IndexOfTaskToBeConsulted = await Task.findById(taskToBeConsulted);

      // cuando pongo un id aleatorio para que me ejecute el else no me lo ejecuto, me de el error de BSON...
      if (IndexOfTaskToBeConsulted) {
        res.json(await Task.find(IndexOfTaskToBeConsulted));
      } else {
        res
          .status(404)
          .send(`No se ha encontrado la tarea con el id: ${taskToBeConsulted}`);
      }
    } catch (error) {
      next(error);
    }
  },
  //filtrar tareas por fecha
  getTasksOfTheDate: async (req, res, next) => {
    try {
      const startDate = new Date(req.params.date);
      startDate.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Añade un día para obtener hasta las 23:59:59

      const taskList = await Task.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      res.json(taskList);
    } catch (error) {
      next(error);
    }
  },
  // añadir una tarea nueva
  addTask: async (req, res, next) => {
    try {
      const data = req.body;
      const taskToAdd = new Task({
        ...data,
        completed: false,
      });

      await taskToAdd.save();

      res.send(`text: Has añadido con éxito tu nueva tarea: ${taskToAdd}`);
    } catch (error) {
      next(error);
    }
  },

  // eliminar una tarea
  deleteTask: async (req, res, next) => {
    try {
      const taskToBeDeleted = req.params.id;
      const indexToBeDeleted = await Task.findById(taskToBeDeleted);

      if (indexToBeDeleted) {
        console.log(indexToBeDeleted);
        await Task.deleteOne({ _id: indexToBeDeleted });
        res.send(`text: Has eliminado con éxito tu tarea : ${taskToBeDeleted}`);
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado la tarea con id: ${taskToBeDeleted}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  // modificar una tarea
  changeTask: async (req, res, next) => {
    try {
      const indexToBeChanged = req.params.id;

      const newDescription = req.body.description;

      const taskToBeChanged = await Task.findById(indexToBeChanged);
      if (taskToBeChanged) {
        taskToBeChanged.description = newDescription;
        await taskToBeChanged.save();
        res.send(`text: Has cambiado con éxito tu tarea : ${taskToBeChanged}`);
      } else {
        res
          .status(404)
          .send(
            `text: No se ha encontrado la tarea con id: ${indexToBeChanged}`
          );
      }
    } catch (error) {
      next(error);
    }
  },
  //completar una tarea
  completeTask: async (req, res, next) => {
    try {
      const taskToBeCompleted = req.params.id;
      const foundTask = await Task.findById(taskToBeCompleted);

      if (!foundTask) {
        res
          .status(404)
          .send(
            `text: No se ha encontrado la tarea con id: ${taskToBeCompleted}`
          );
      } else {
        if (foundTask.completed) {
          foundTask.completed = false;
          await foundTask.save();
          res.send(
            `text: No has completado la tarea: ${foundTask.description}`
          );
        } else {
          foundTask.completed = true;
          await foundTask.save();
          res.send(`text: Has completado la tarea: ${foundTask.description}`);
        }
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = tasksController;
