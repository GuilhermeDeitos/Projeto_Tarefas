import express, {Request, Response, Router} from "express";
import { TaskController } from "../Controllers/task.controller";

const router: Router = express.Router();
const taskController = new TaskController();

router.get("/tasks", (res:Response) => {
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