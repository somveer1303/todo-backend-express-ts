import { z } from 'zod';

export const TaskSchemaZ = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['done', 'pending', 'canceled']),
  priority: z.enum(['low', 'medium', 'high']),
});

export const UpdateTaskZ = TaskSchemaZ.partial();

export const TaskIdSchema = z.object({
  id: z.string(),
});

export type Task = z.infer<typeof TaskSchemaZ>;
export type UpdateTask = z.infer<typeof UpdateTaskZ>;
