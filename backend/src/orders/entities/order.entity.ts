import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { OrderStatus } from './status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('jsonb')
  orderItems: CartItem[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column('simple-json')
  delivery: {
    address: string;
    appartment: number;
    entrance: number;
    floor: number;
    comments: string;
  };

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Column()
  userName: string;
}
