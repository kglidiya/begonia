import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartModule } from './cart/cartItem.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import typeorm from './config/typeorm';

@Module({
  imports: [
    JwtModule,
    ItemsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    CartModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: process.env.MAILDEV_SERVICE,
          host: process.env.MAILDEV_HOST,
          port: Number(process.env.MAILDEV_PORT),
          secure: false,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS
          }
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>'
        }
      })
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
