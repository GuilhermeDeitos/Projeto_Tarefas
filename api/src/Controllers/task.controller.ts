import { ServerDataSource } from "../config/db";
import { Request, Response } from "express";
import { Task } from "../Models/Entities/task.entity";
import { CreateTaskDTO, UpdateTaskDTO } from "../Models/DTO/task.dto";
import { validate } from "class-validator";
import {plainToInstance} from "class-transformer";
import { Repository } from "typeorm";

export class TaskController {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = ServerDataSource.getRepository(Task);
  }

  async getAllTasks(res: Response): Promise<Response> {
    try {
      const tasks = await this.taskRepository.find();
      if (tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching tasks" });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<Response> {
    const taskId = parseInt(req.params.id);
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching task" });
    }
  }

  async createTask(req: Request, res: Response): Promise<Response> {
    // 1. Transformar e validar o DTO
    const taskDTO = plainToInstance(CreateTaskDTO, req.body);
    const errors = await validate(taskDTO);

    if (errors.length > 0) {
      const errorMessages = errors.flatMap(error => 
        Object.values(error.constraints || {})
      );
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errorMessages 
      });
    }

    try {
      const task = this.taskRepository.create(taskDTO);
      const newTask = await this.taskRepository.save(task);
      return res.status(201).json(newTask);
    } catch (error: any) {
      return res.status(500).json({ 
        message: "Error creating task",
        error: error.message 
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<Response> {
    const taskId = parseInt(req.params.id);
    const updateDTO = plainToInstance(UpdateTaskDTO, req.body);
    const errors = await validate(updateDTO);

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors.map(e => Object.values(e.constraints || {})).flat() 
      });
    }

    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      this.taskRepository.merge(task, updateDTO);      
      const updatedTask = await this.taskRepository.save(task);
      return res.status(200).json(updatedTask);
    } catch (error: any) {
      return res.status(500).json({ 
        message: "Error updating task",
        error: error.message 
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<Response> {
    const taskId = parseInt(req.params.id);
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      await this.taskRepository.delete(taskId);
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting task" });
    }
  }

}