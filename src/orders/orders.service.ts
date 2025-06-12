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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    this.logger.log(`Updating order #${id}`, updateOrderDto);

    // Delete existing products related to this order
    await this.prismaService.orderProduct.deleteMany({
      where: { orderId: id },
    });

    // Update the order and recreate product links
    return this.prismaService.order.update({
      where: { id },
      data: {
        orderNumber: updateOrderDto.orderNumber,
        status: updateOrderDto.status,
        ...(updateOrderDto.products && {
          products: {
            create: updateOrderDto.products.map((p) => ({
              qty: p.qty,
              unitPrice: p.unitPrice,
              product: {
                connect: { id: p.productId },
              },
            })),
          },
        }),
      },
    });
  }

  remove(id: number) {
    this.logger.log(`Removing order with id: ${id}`);
    return this.prismaService.order.delete({
      where: { id },
    });
  }
}
