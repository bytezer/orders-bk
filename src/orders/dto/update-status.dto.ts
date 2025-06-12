import { IsEnum } from 'class-validator';
import { OrderStatus } from 'generated/prisma';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
