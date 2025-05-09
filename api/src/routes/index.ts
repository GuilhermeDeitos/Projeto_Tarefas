import express, {Request, Response, Router} from "express";
import { TaskController } from "../controllers/task.controller";
import { ServerDataSource } from "../config/db";
import { Task } from "../models/Entities/task.entity";

const router: Router = express.Router();
const taskRepository = ServerDataSource.getRepository(Task);
const taskController = new TaskController(taskRepository);

router.get("/tasks", (req:Request,res:Response) => {
  taskController.getAllTasks(res);
});

router.get("/tasks/:id", (req:Request, res:Response) => {
  taskController.getTaskById(req, res);
});

router.post("/tasks", (req:Request, res:Response) => {
  taskController.createTask(req, res);
});

router.put("/tasks/:id", (req:Request, res:Response) =>{
  taskController.updateTask(req, res);
});

router.delete("/tasks/:id", (req:Request, res:Response) =>{
  taskController.deleteTask(req, res);
});

export default router;