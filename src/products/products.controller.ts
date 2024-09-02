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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';
import { AdminGuard, UserGuard } from '../users/utils/authenticator.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(UserGuard)
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ) {
    const product = await this.productsService.findOne({
      SKU: createProductDto.SKU,
    });
    if (product) {
      throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
    }
    return this.productsService.create(createProductDto);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
