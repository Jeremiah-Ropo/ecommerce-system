import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { AdminGuard, UserGuard } from 'src/users/utils/authenticator.guard';

@Module({
  providers: [ProductsService, UserGuard, AdminGuard],
  controllers: [ProductsController],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
})
export class ProductsModule {}
