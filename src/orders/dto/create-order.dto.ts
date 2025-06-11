import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'generated/prisma';

export class CreateOrderProductDto {
  @IsNotEmpty()
  @Type(() => Number)
  productId: number;

  @IsNotEmpty()
  @Type(() => Number)
  qty: number;

  @IsNotEmpty()
  @Type(() => Number)
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
