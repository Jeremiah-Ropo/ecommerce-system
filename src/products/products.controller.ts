import {
  Controller,
  Post,
  UseGuards,
  Get,
  ValidationPipe,
  Query,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';
import { AdminGuard, UserGuard } from '../users/utils/authenticator.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(UserGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createProduct(@Body() createProduct: CreateProductDto) {
    try {
      const product = await this.productsService.findOne({
        SKU: createProduct.SKU,
      });
      if (product) {
        throw new HttpException(
          'Product already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.productsService.create(createProduct);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async getAllProductsUnregisted(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('name') name?: string,
    @Query('price') price?: number,
    @Query('isApproved') isApproved?: boolean,
  ) {
    try {
      const query = {
        isApproved: true,
      };
      if (name) query['name'] = name;
      if (price) query['price'] = price;
      if (isApproved) query['isApproved'] = isApproved;
      return this.productsService.findAll(query, { limit, page });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('all')
  @UseGuards(UserGuard)
  async getAllUserProducts(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('name') name?: string,
    @Query('price') price?: number,
    @Query('isApproved') isApproved?: boolean,
  ) {
    try {
      const query = {};
      if (name) query['name'] = name;
      if (price) query['price'] = price;
      if (isApproved) query['isApproved'] = isApproved;
      return this.productsService.findAll(query, { limit, page });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('approve/:id')
  @UseGuards(AdminGuard)
  async approveProduct(
    @Param('id') id: string,
    @Body('isApproved') isApproved: boolean,
  ) {
    try {
      const product = await this.productsService.findById(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return this.productsService.update(id, { isApproved });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    try {
      const product = await this.productsService.findById(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseGuards(UserGuard)
  async getProduct(@Param('id') id: string) {
    try {
      const product = await this.productsService.findById(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  async deleteProduct(@Param('id') id: string) {
    try {
      const product = await this.productsService.findById(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return this.productsService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
