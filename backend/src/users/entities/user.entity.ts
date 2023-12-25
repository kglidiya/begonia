import { IsEmail } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Role } from './role.enum';
import { CartItem } from 'src/cart/entities/cartItem.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  recoveryCode: number;

  @Column({default: ''})
  refreshToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cart: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
