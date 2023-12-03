import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Item, (item) => item.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  item: Item;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  subTotal: number;
}
