import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone: string;
}
