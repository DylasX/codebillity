import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import RoleEnum from '../enums/role.enum';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    type: 'enum',
    enum: RoleEnum,
    nullable: false,
    default: RoleEnum.User,
  })
  @IsString()
  name: RoleEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users: Promise<User[]>;
}
