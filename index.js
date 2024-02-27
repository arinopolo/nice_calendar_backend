const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./errorHandler");

const taskRouter = require("./routes/taskRouter");
const Task = require("./models/taskModel");

const connectionToDataBase = process.env.DB_CREDENTIALS;
const port = process.env.PORT;

mongoose.connect(
  `mongodb+srv://${connectionToDataBase}@arinopolo.iq4vync.mongodb.net/todoapp?retryWrites=true&w=majority`
);

app.use(express.json());
app.use(cors());

app.use("/tasks", taskRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Servidor rulando");
});
