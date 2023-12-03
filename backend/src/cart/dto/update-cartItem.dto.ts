import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cartItem.dto';

export class UpdateCartDto extends PartialType(CreateCartItemDto) {}
