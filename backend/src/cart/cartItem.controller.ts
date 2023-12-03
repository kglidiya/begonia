import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common';
import { CartService } from './cartItem.service';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { UpdateCartDto } from './dto/update-cartItem.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.emun';

@UseGuards(AccessTokenGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Req() req, @Body() createCartItemDto: CreateCartItemDto) {
    const userId = req.user['sub'];
    return this.cartService.create(userId, createCartItemDto);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user['sub'];
    return this.cartService.findAll(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Patch()
  update(@Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(updateCartDto);
  }

  @Delete()
  remove(@Body() item: any) {
    return this.cartService.remove(item.id);
  }
}
5;
