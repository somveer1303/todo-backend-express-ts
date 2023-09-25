import { Router } from 'express';
import TaskController from '@/controllers/tasks.controller';
import { Routes } from '@interfaces/routes.interface';
import { TaskSchemaZ, UpdateTaskZ, TaskIdSchema } from '@dtos/task.dtos';

import { validateRequestBody, validateRequestParams } from '@middlewares/validation.middleware';
import { authMiddleware } from '@middlewares/auth.middleware';

class TaskRoute implements Routes {
  public path = '/task';
  public router = Router();
  public tasksController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/`, authMiddleware, this.tasksController.getUserTasks);
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      validateRequestParams(TaskIdSchema),
      this.tasksController.getTaskByID,
    );
    this.router.post(
      `${this.path}/`,
      authMiddleware,
      validateRequestBody(TaskSchemaZ),
      this.tasksController.createTask,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validateRequestBody(UpdateTaskZ),
      this.tasksController.updateTask,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.tasksController.deleteTask);
  }
}
export default TaskRoute;
