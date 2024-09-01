import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: any): Promise<Product> {
    const createdProduct = await this.productModel.create(createProductDto);
    return createdProduct;
  }

  async findAll(query: any, { limit, page }): Promise<Product[]> {
    const products = await this.productModel
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    const updateProductById = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    return updateProductById;
  }

  async delete(id: string): Promise<Product> {
    const deleteProductById = await this.productModel
      .findByIdAndDelete(id)
      .exec();
    return deleteProductById;
  }
}
