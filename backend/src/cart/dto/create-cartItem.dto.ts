import { IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}
