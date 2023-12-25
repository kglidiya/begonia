import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.emun';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Order } from './entities/order.entity';
import { DeleteResult } from 'typeorm';

@UseGuards(AccessTokenGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const userId = req.user['sub'];
    return this.ordersService.create(userId, createOrderDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query() seachParam: { query: string; limit: number; offset: number }
  ): Promise<
    | Order[]
    | {
        chunk: Order[];
        total: number;
      }
  > {
    const { query, limit, offset } = seachParam;
    return this.ordersService.findAll(query, limit, offset);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Get('/me')
  findMyOrders(@Req() req): Promise<Order[]> {
    const userId = req.user['sub'];
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(+id);
  }

  @Patch()
  update(@Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(updateOrderDto);
  }

  @Delete()
  remove(@Body('id') id: string): Promise<DeleteResult> {
    return this.ordersService.remove(+id);
  }
}
