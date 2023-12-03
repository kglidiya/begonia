import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsUrl,
  IsString,
  IsOptional,
  Length,
  IsObject,
  IsArray,
} from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import { OrderStatus } from '../entities/status.enum';
import { CartItem } from 'src/cart/entities/cartItem.entity';

export class CreateOrderDto {
  
    @IsObject()
    delivery: {
      address: string;
      appartment: number;
      entrance: number;
      floor: number;
      comments: string;
    };
  
    @IsString()
    phone: string
    
    @IsString()
    @IsOptional()
    status: OrderStatus;

    @IsArray()
    orderItems: CartItem[]

    @IsString()
    userName: string
}
