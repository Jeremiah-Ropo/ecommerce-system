import { Controller, Post, UseGuards, Get, ValidationPipe, PipeTransform } from '@nestjs/common'; 
import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
import { UserGuard } from '../users/utils/authenticator.guard';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }
    
    @Post()
    @UseGuards(UserGuard)
    async createProduct(
        // @Body(ValidationPipe) createProductDto: CreateProductDto
    ) {
        // return this.productsService.createProduct(createProductDto);
    }
}
