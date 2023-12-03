import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/entities/item.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { CartModule } from './cart/cartItem.module';
import { CartItem } from './cart/entities/cartItem.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule,
    ItemsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [Item, User, Order, CartItem],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: process.env.POSTGRES_PORT,
    //   username: 'admin',
    //   password: 'admin',
    //   database: 'begonia',
    //   entities: [Item, User, Order, CartItem],
    //   synchronize: true
    // }),
    AuthModule,
    UsersModule,
    OrdersModule,
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true
    }),
    CartModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: 'lgkosinova@gmail.com',
            pass: 'dymjrmozbtykhtgi'
          }
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>'
        }
        
      })
    }),

  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },]
})
export class AppModule {}
