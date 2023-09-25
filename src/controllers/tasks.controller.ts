import { Request } from 'express';
import { ITask } from '@interfaces/task.interface';
import { CustomResponse } from '@interfaces/response.interface';
import TaskService from '@services/tasks.service';
import { logger } from '@/utils/logger.utils';
import { getUserFromContext } from '@/utils/context.utils';

class taskController {
  public taskService = new TaskService();

  public getUserTasks = async (req: Request, res: CustomResponse) => {
    try {
      const userInfo = getUserFromContext();
      const response = await this.taskService.getUserTasks(userInfo.id);

      if (response.ok) {
        return res.success({ code: 201, data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public getTaskByID = async (req: Request, res: CustomResponse) => {
    try {
      const taskId: string = req.params.id;
      console.log(taskId);
      if (!taskId) {
        return res.invalid({ msg: 'taskId is missing' });
      }
      const response = await this.taskService.getTaskByID(taskId);

      if (response.ok) {
        return res.success({ data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public createTask = async (req: Request, res: CustomResponse) => {
    try {
      const taskData: ITask = req.body;
      const userInfo = getUserFromContext();
      taskData.userId = userInfo.id;
      const response = await this.taskService.createTask(taskData);

      if (response.ok) {
        return res.success({ data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public updateTask = async (req: Request, res: CustomResponse) => {
    try {
      const taskData: ITask = req.body;
      const taskId = req.params.id;
      taskData.id = taskId;

      if (!taskId) {
        return res.invalid({ msg: 'taskId is missing' });
      }

      const response = await this.taskService.updateTask(taskData);

      if (response.ok) {
        return res.success({ data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public deleteTask = async (req: Request, res: CustomResponse) => {
    try {
      const taskId: string = req.params.id;
      const response = await this.taskService.deleteTask(taskId);

      if (response.ok) {
        return res.success({ data: {} });
      }
      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };
}

export default taskController;
