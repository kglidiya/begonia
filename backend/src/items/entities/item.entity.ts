import { Length, IsUrl, ValidateIf } from 'class-validator';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable
} from 'typeorm';
import { Type } from './type.emun';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: Type, default: Type.ELATIOR })
  type: Type;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ default: '' })
  @ValidateIf((value) => value.galleryImage1 !== '')
  @IsUrl()
  galleryImage1: string | '';

  @Column({ default: '' })
  @ValidateIf((value: Item) => value.galleryImage2 !== '')
  @IsUrl()
  galleryImage2: string;

  @Column({ default: '' })
  @ValidateIf((value: Item) => value.galleryImage3 !== '')
  @IsUrl()
  galleryImage3: string;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column()
  price: number;

  @Column()
  article: number;

  @Column()
  quantity: number;

  @OneToMany(() => CartItem, (cart) => cart.item, { cascade: true })
  @JoinTable()
  cart: CartItem[];
}
