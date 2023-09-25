import { Repository } from 'typeorm';
import { Task } from '@/database/entity/task.entity';
import { AppDataSource } from '@/utils/typeorm';

export class TaskRepository {
  private taskRepository: Repository<Task>;
  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }
  async createTask(taskData: Partial<Task>): Promise<Task | undefined> {
    try {
      const task = this.taskRepository.create(taskData);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`Unable to create task: ${error.message}`);
    }
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    try {
      return await this.taskRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Unable to fetch task: ${error.message}`);
    }
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task | undefined> {
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) return undefined;

      Object.assign(task, taskData);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`Unable to update task: ${error.message}`);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      throw new Error(`Unable to delete task: ${error.message}`);
    }
  }

  async getAllTasksForUser(userId: string): Promise<Task[]> {
    try {
      return await this.taskRepository
        .createQueryBuilder('tasks')
        .where('tasks.user_id = :userId', { userId })
        .getMany();
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to fetch tasks for user: ${error.message}`);
    }
  }
}
