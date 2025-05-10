import { Request, Response } from "express";
import { validate } from "class-validator";
import { TaskController } from "../controllers/task.controller";
import { getRepository } from "./mock.typeorm";

// Mock para as requisições Express
const mockRequest = (body?: any, params?: any) => {
  return {
    body,
    params,
  } as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock para as validações do class-validator
jest.mock("class-validator", () => {
  return {
    ...jest.requireActual("class-validator"),
    validate: jest.fn().mockResolvedValue([]), // Mocking class-validator to return no errors
  };
});


describe("TaskController", () => {
  let controller: TaskController;
  let mockRepository: any;

  //Inicializa o repositório simulado e o controlador antes de cada teste
  beforeEach(() => {
    mockRepository = getRepository();
    controller = new TaskController(mockRepository);
    jest.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", description: "Description 1" },
      ];

      mockRepository.find.mockResolvedValue(mockTasks);
      const res = mockResponse();
      await controller.getAllTasks(res);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 404 if no tasks found", async () => {
      mockRepository.find.mockResolvedValue([]);
      const res = mockResponse();
      await controller.getAllTasks(res);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No tasks found" });
    });

    it("should return 500 if an error occurs", async () => {
      mockRepository.find.mockRejectedValue(new Error("Database error"));
      const res = mockResponse();
      await controller.getAllTasks(res);

      expect(mockRepository.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching tasks",
      });
    });
  });

  describe("getTaskById", () => {
    it("should return a task by ID", async () => {
      const mockTask = { id: 1, title: "Task 1", description: "Description 1" };

      mockRepository.findOneBy.mockResolvedValue(mockTask);
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      await controller.getTaskById(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 404 if task not found", async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      await controller.getTaskById(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 if an error occurs", async () => {
      mockRepository.findOneBy.mockRejectedValue(new Error("Database error"));
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      await controller.getTaskById(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching task" });
    });
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const mockTask = {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "Pending",
      };

      const req = mockRequest({
        title: "Task 1",
        description: "Description 1",
      });
      const res = mockResponse();
      mockRepository.create.mockReturnValue(mockTask); 
      mockRepository.save.mockResolvedValue(mockTask); 
      await controller.createTask(req, res);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Task 1",
          description: "Description 1",
          status: "Pending",
        })
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 400 if validation fails", async () => {
      const req = mockRequest({ title: "", description: "" });
      const res = mockResponse();
      (validate as jest.Mock).mockResolvedValue([
        { constraints: { isNotEmpty: "Title should not be empty" } },
      ]);
      await controller.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Validation failed",
        errors: ["Title should not be empty"],
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = mockRequest({
        title: "Task 1",
        description: "Description 1",
      });
      const res = mockResponse();
      (validate as jest.Mock).mockResolvedValue([]);
      mockRepository.save.mockRejectedValue(new Error("Database error"));
      await controller.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating task",
        error: "Database error",
      });
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const mockTask = {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "Pending",
      };
      
      const req = mockRequest(
        { title: "Updated Task", description: "Updated Description" },
        { id: 1 }
      );
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);
      (validate as jest.Mock).mockResolvedValue([]);
      await controller.updateTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 404 if task not found", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue(null);
      await controller.updateTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 400 if validation fails", async () => {
      const req = mockRequest({ title: "", description: "" }, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue({ id: 1 });
      (validate as jest.Mock).mockResolvedValue([
        { constraints: { isNotEmpty: "Title should not be empty" } },
      ]);
      await controller.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Validation failed",
        errors: ["Title should not be empty"],
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockRepository.save.mockRejectedValue(new Error("Database error"));
      (validate as jest.Mock).mockResolvedValue([]);
      await controller.updateTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating task",
        error: "Database error",
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await controller.deleteTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task not found", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue(null);
      await controller.deleteTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 if an error occurs", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();
      mockRepository.findOneBy.mockResolvedValue({ id: 1 }); // Simula encontrar a tarefa
      mockRepository.delete.mockRejectedValue(new Error("Database error")); // Simula erro no delete
      await controller.deleteTask(req, res);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error deleting task",
        error: "Database error",
      });
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
