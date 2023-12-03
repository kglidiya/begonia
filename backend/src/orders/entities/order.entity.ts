import { Length, IsEmail, IsUrl, IsObject } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { OrderStatus } from './status.enum';

interface test {
  item: Item,
  quantity: number,
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => CartItem, (cartItem) => cartItem.user)

  // orderItems: CartItem[];
  // @Column('simple-array')
  @Column('jsonb')
  orderItems: CartItem[];
  // @OneToMany(() => User, (user) => user.cart, { cascade: true })
  // orderItems: CartItem[];
  // @ManyToMany(() => CartItem, { onDelete: 'CASCADE' })
  // @JoinTable()
  // orderItems: CartItem[];

  @ManyToOne(() => User, (user) => user.id, {onDelete: 'CASCADE'})
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
  phone: string
  
  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED})
  status: OrderStatus;

  @Column() 
  userName: string
  
}
function ApiModelProperty(arg0: { isArray: boolean; }): (target: Order, propertyKey: "orderItems") => void {
  throw new Error('Function not implemented.');
}

