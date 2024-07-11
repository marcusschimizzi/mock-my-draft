import { IsEmail, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type: 'text' })
  @MinLength(3)
  username!: string;

  @Column({ type: 'text' })
  @MinLength(8)
  password!: string;

  @Column({ unique: true, type: 'text' })
  @IsEmail()
  email!: string;

  @Column({ default: false, type: 'boolean' })
  isAdmin!: boolean;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  lastLogin?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt?: Date;
}
