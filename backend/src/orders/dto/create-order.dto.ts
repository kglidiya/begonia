import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsNumber
} from 'class-validator';
import { OrderStatus } from '../entities/status.enum';
import { CartItem } from 'src/cart/entities/cartItem.entity';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsObject()
  delivery: {
    address: string;
    appartment: number;
    entrance: number;
    floor: number;
    comments: string;
  };

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  status: OrderStatus;

  @IsArray()
  orderItems: CartItem[];

  @IsString()
  userName: string;
}
