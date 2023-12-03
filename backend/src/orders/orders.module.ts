import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { Item } from 'src/items/entities/item.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, CartItem, Item]),  JwtModule,],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
