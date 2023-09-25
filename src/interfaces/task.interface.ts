import { Task, UpdateTask } from '@dtos/task.dtos';

export type TaskStatus = 'done' | 'pending' | 'canceled';
export type TaskPriority = 'low' | 'medium' | 'high';
export interface ITask extends Task {
  id?: string;
  userId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
