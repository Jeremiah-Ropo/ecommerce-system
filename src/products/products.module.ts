import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { AdminGuard, UserGuard } from 'src/users/utils/authenticator.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ProductsService, UserGuard, AdminGuard],
  controllers: [ProductsController],
  imports: [  UsersModule, MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ConfigModule.forRoot(),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
    }),
  })
  ],
})
export class ProductsModule {}
