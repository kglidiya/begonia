import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DeleteResult, Like, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { OrderStatus } from './entities/status.enum';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.item']
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    const itemsId = [];
    createOrderDto.orderItems.forEach((el) => itemsId.push(el.item.id));
    const itemsActual = await this.itemsRepository
      .createQueryBuilder('items')
      .whereInIds(itemsId)
      .getMany();

    const isAvaiable = itemsActual.some(
      (item, i) => item.quantity >= createOrderDto.orderItems[i].quantity
    );

    if (!isAvaiable) {
      throw new ConflictException(
        'Недостаточное количество товара. Вернитесь в корзину для корректировки'
      );
    } else {
      createOrderDto.orderItems.forEach(async (orderItem) => {
        const quantityToOrder = orderItem.quantity;

        await this.itemsRepository.update(orderItem.item.id, {
          quantity: orderItem.item.quantity - quantityToOrder
        });
      });

      const newOrder = this.ordersRepository.create({
        user,
        ...createOrderDto
      });

      if (newOrder) {
        const cartToRemove = await this.cartRepository.find({
          where: { user: { id: userId } }
        });

        cartToRemove.forEach(
          async (item) => await this.cartRepository.remove(item)
        );
      }

      return await this.ordersRepository.save(newOrder);
    }
  }

  async findAll(
    query: string,
    limit: number,
    offset: number
  ): Promise<
    | Order[]
    | {
        chunk: Order[];
        total: number;
      }
  > {
    if (query) {
      return await this.ordersRepository.find({
        where: [
          { user: { email: Like(`%${query}%`) } },
          { phone: Like(`%${query}%`) }
        ],
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });
    } else {
      const ordersQuantity = await this.ordersRepository.find({
        where: { status: Not(OrderStatus.CANCELLED) }
      });
      return {
        chunk: await this.ordersRepository.find({
          where: { status: Not(OrderStatus.CANCELLED) },
          relations: ['user'],
          order: { createdAt: 'DESC' },
          skip: offset,
          take: limit,
          cache: true
        }),
        total: ordersQuantity.length
      };
    }
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });
  }

  async update(updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { id, status } = updateOrderDto;
    const order = await this.ordersRepository.find({ where: { id } });
    if (!order) {
      throw new BadRequestException('Такой заказ не найден');
    }
    //при отмене заказа увеличиваем количество товара на то кол-во, которое было в отмененном заказе
    if (status === OrderStatus.CANCELLED) {
      const items = order[0].orderItems;
      const itemsId = [];
      items.forEach((el) => itemsId.push(el.item.id));

      const itemsUpdated = await this.itemsRepository
        .createQueryBuilder('items')
        .whereInIds(itemsId)
        .getMany();

      itemsUpdated.forEach(async (el, i) => {
        await this.ordersRepository
          .createQueryBuilder('item')
          .update<Item>(Item, {
            quantity: el.quantity + items[i].quantity
          })
          .where({ id: el.id })
          .returning('*')
          .execute();
      });
    }
    const orderToUpdate = await this.ordersRepository
      .createQueryBuilder('cartItem')
      .update<Order>(Order, {
        ...updateOrderDto,
        status
      })
      .where({ id })
      .returning('*')
      .execute();
    return orderToUpdate.raw[0];
  }

  async remove(id: number): Promise<DeleteResult> {
    const orderToDelete = await this.ordersRepository.findOne({
      where: { id }
    });
    if (!orderToDelete) {
      throw new BadRequestException('Такой заказ не найден');
    }
    if (orderToDelete.status === OrderStatus.CREATED) {
      return await this.ordersRepository.delete(id);
    } else
      throw new ForbiddenException(
        'Вы не можене удалить принятый в работу заказ'
      );
  }
}
