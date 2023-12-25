import { Module } from '@nestjs/common';
import { CartService } from './cartItem.service';
import { CartController } from './cartItem.controller';
import { CartItem } from './entities/cartItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Item, User]), JwtModule],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
