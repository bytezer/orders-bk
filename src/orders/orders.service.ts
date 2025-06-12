import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);
  constructor(private prismaService: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    this.logger.log('Creating a new order', createOrderDto);
    return this.prismaService.order.create({
      data: {
        orderNumber: createOrderDto.orderNumber,
        status: createOrderDto.status,
        products: {
          create: createOrderDto.products.map((p) => ({
            qty: p.qty,
            unitPrice: p.unitPrice,
            product: {
              connect: { id: p.productId },
            },
          })),
        },
      },
    });
  }

  findAll() {
    return this.prismaService.order.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        products: true,
      },
    });
  }

  findOne(id: number) {
    this.logger.log(`Finding order with id: ${id}`);
    return this.prismaService.order.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    this.logger.log(`Removing order with id: ${id}`);
    return this.prismaService.order.delete({
      where: { id },
    });
  }
}
