
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    SKU: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;
}

