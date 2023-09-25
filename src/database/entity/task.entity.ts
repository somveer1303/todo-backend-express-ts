import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['done', 'pending', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;
}
