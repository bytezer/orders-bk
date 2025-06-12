import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsNumber()
  @IsPositive({ message: 'Unit price must be a positive number' })
  unitPrice: number;
}
