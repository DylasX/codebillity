import { IsEmail, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  BaseEntity,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/entities/role.entity';

@Entity()
export class User extends BaseEntity {
  constructor(user?: Partial<User>) {
    super();
    if (user) {
      this.name = user.name;
      this.lastName = user.lastName;
      this.email = user.email;
      this.password = user.password;
      this.roles = user.roles;
      this.phone = user.phone;
    }
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ name: 'phone', type: 'varchar', nullable: false })
  @IsString()
  phone: string;

  @Column({ name: 'password', type: 'varchar', nullable: false, select: false })
  @IsString()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles: Promise<Role[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compareSync(password, this.password);
  }

  async getRoles(): Promise<string[]> {
    const roles = await this.roles;
    return roles.map((role) => role.name);
  }
}
