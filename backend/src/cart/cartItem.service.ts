import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cartItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cartItem.entity';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';

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

  async create(userId: number, createCartItemDto: any): Promise<any> {
    const { id, quantity } = createCartItemDto;
    // console.log(quantity)
    const item = await this.itemsRepository.findOne({
      where: { id }
    });

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.item']
    });

    const existingCartItem = user.cart.filter((el) => el.item.id === id);

    if (existingCartItem.length > 0) {
      // console.log('existingCartItem.length > 0')
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
    if (existingCartItem.length === 0) {
      //  console.log('existingCartItem.length === 0')
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

  async update(updateCartDto: UpdateCartDto) {
    const { id, quantity } = updateCartDto;
    // console.log(updateCartDto)
    const cartToUpdate = await this.cartRepository.findOne({
      where: { id },
      relations: ['item']
    });
    // console.log(cartToUpdate)
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
    // console.log(t)
    // return t
  }

  async findAll(userId: number) {
    return await this.cartRepository.find({
      relations: ['item', 'user'],
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' }
    });
    // console.log(t)
    // return t
  }

  async findOne(userId: number, itemId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.item']
    });

    const existingCartItem = user.cart.filter((el) => el.item.id === itemId);
    if (existingCartItem.length > 0) {
      return await this.cartRepository.findOne({
        where: { item: { id: itemId } },
        relations: ['user', 'item']
      });
    }
  }

  async remove(id: number) {
    return await this.cartRepository.delete(id);
  }
}
