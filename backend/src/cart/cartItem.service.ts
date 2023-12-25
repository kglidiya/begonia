import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cartItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CartItem } from './entities/cartItem.entity';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCartItemDto } from './dto/create-cartItem.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(
    userId: number,
    createCartItemDto: CreateCartItemDto
  ): Promise<CartItem> {
    const { id, quantity } = createCartItemDto;
    const item = await this.itemsRepository.findOne({
      where: { id }
    });
    if (!item) throw new BadRequestException('Товар не найден');

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.item']
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    //проверяем, есть ли уже такой товар в корзине
    const existingCartItem = user.cart.filter((el) => el.item.id === id);

    //есть товар уже в корзине, меняем количество
    if (existingCartItem.length > 0) {
      await this.cartRepository
        .createQueryBuilder('cartItem')
        .update<CartItem>(CartItem, {
          quantity,
          subTotal: quantity * item.price
        })
        .where({ item: { id } })
        .execute();

      return await this.cartRepository.findOne({
        where: { item: { id } },
        relations: ['user', 'item']
      });
    }
    //если такого товара нет, довавляем в корзину
    if (existingCartItem.length === 0) {
      const cartItemNew = this.cartRepository.create({
        user,
        item,
        quantity: quantity,
        subTotal: item.price * quantity
      });
      await this.cartRepository.save(cartItemNew);
      return cartItemNew;
    }
  }

  async update(updateCartDto: UpdateCartDto): Promise<CartItem> {
    const { id, quantity } = updateCartDto;
    const cartToUpdate = await this.cartRepository.findOne({
      where: { id },
      relations: ['item']
    });

    if (!cartToUpdate) throw new BadRequestException('Товар не найден');

    await this.cartRepository
      .createQueryBuilder('cartItem')
      .update<CartItem>(CartItem, {
        ...updateCartDto,
        subTotal: quantity * cartToUpdate.item.price,
        quantity
      })
      .where({ id })
      .execute();

    return await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'item']
    });
  }

  async findAll(userId: number): Promise<CartItem[]> {
    return await this.cartRepository.find({
      relations: ['item', 'user'],
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' }
    });
  }

  async findOne(userId: number, itemId: number): Promise<CartItem> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.item']
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    const existingCartItem = user.cart.filter((el) => el.item.id === itemId);

    if (existingCartItem.length > 0) {
      return await this.cartRepository.findOne({
        where: { item: { id: itemId } },
        relations: ['user', 'item']
      });
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.cartRepository.delete(id);
  }
}
