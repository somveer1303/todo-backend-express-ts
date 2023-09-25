import { Entity, Column, OneToMany, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
