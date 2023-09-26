import { Entity, Column, PrimaryColumn } from 'typeorm';
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

  @Column({ nullable: true })
  phone: string;
}
