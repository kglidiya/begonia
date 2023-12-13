import { IsUrl, IsString, IsNumber, Length, ValidateIf } from 'class-validator';
import { Type } from '../entities/type.emun';
import { Item } from '../entities/item.entity';

export class CreateItemDto {
  @IsString()
  type: Type;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @ValidateIf((value: Item) => value.galleryImage1 !== '')
  @IsUrl()
  galleryImage1: string;

  @ValidateIf((value: Item) => value.galleryImage2 !== '')
  @IsUrl()
  galleryImage2: string;

  @ValidateIf((value: Item) => value.galleryImage3 !== '')
  @IsUrl()
  galleryImage3: string;

  @IsString()
  @Length(0, 1024)
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
