import { IServiceResponse } from '@interfaces/service.interface';
import { ITask, TaskStatus, TaskPriority } from '@interfaces/task.interface';
import { TaskRepository } from '@/database/repository/task.repository';
// import { Task } from '@dtos/task.dtos';

// const convertITaskToTask = (tasks: Task[]): ITask[] => {
//   return tasks.map(task => ({
//     id: task.id,
//     userId: task.userId,
//     title: task.title,
//     description: task.description,
//     status: task.status as TaskStatus,
//     priority: task.priority as TaskPriority,
//   }));
// };

class AuthService {
  private tasksRepository = new TaskRepository();

  public async getUserTasks(userId: string): Promise<IServiceResponse<ITask[]>> {
    try {
      const result = await this.tasksRepository.getAllTasksForUser(userId);
      const tasks: ITask[] = result.map(task => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
      }));

      return {
        ok: true,
        data: tasks || ([] as ITask[]),
      };
    } catch (error) {
      throw error;
    }
  }

  public async getTaskByID(taskId: string): Promise<IServiceResponse<ITask>> {
    try {
      const result = await this.tasksRepository.getTaskById(taskId);
      if (!result) {
        return {
          ok: false,
          err: 'No Task found with this id: ' + taskId,
        };
      }

      const task: ITask = {
        id: result.id,
        userId: result.userId,
        title: result.title,
        description: result.description,
        status: result.status as TaskStatus,
        priority: result.priority as TaskPriority,
      };

      return {
        ok: true,
        data: task || ({} as ITask),
      };
    } catch (error) {
      throw error;
    }
  }

  public async createTask(taskData: ITask): Promise<IServiceResponse<ITask>> {
    try {
      const result = await this.tasksRepository.createTask({ ...taskData });

      if (!result) {
        return {
          ok: false,
          err: 'Unable to create task',
        };
      }

      const task: ITask = {
        id: result.id,
        userId: result.userId,
        title: result.title,
        description: result.description,
        status: result.status as TaskStatus,
        priority: result.priority as TaskPriority,
      };

      return {
        ok: true,
        data: task,
      };
    } catch (err) {
      throw err;
    }
  }

  public async updateTask(taskData: ITask): Promise<IServiceResponse<ITask>> {
    try {
      const result = await this.tasksRepository.updateTask(taskData.id, { ...taskData });
      if (!result) {
        return {
          ok: false,
          err: 'No Task found with this id: ' + taskData.id,
        };
      }

      const task: ITask = {
        id: result.id,
        userId: result.userId,
        title: result.title,
        description: result.description,
        status: result.status as TaskStatus,
        priority: result.priority as TaskPriority,
      };

      return {
        ok: true,
        data: task,
      };
    } catch (err) {
      throw err;
    }
  }

  public async deleteTask(taskId): Promise<IServiceResponse<ITask>> {
    try {
      const result = await this.tasksRepository.getTaskById(taskId);

      if (!result) {
        return {
          ok: false,
          err: 'No Task found with this id: ' + taskId,
        };
      }

      await this.tasksRepository.deleteTask(taskId);

      return {
        ok: true,
        data: {},
      };
    } catch (err) {
      throw err;
    }
  }
}

export default AuthService;
