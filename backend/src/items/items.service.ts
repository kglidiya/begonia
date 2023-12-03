import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { Type } from './entities/type.emun';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = this.itemsRepository.create(createItemDto);
    await this.itemsRepository.save(item);
    return item;
  }

  async findAll(type: Type, page: number, resultPerPage: number) {
    const skip = resultPerPage * (page - 1);

    if (type === Type.ALL) {
      const res = await this.itemsRepository.find({order: { name: 'ASC' }});
      return {
        res: (await this.itemsRepository.find({
          take: resultPerPage,
          skip: skip,
          order: { name: 'ASC' }
        })) as Item[],
        total: res.length as number,
        itemsAll: res
      };
    } else {
      const res = await this.itemsRepository.find({
        where: { type: type }
      });
      return {
        res: (await this.itemsRepository.find({
          where: { type },
          take: resultPerPage,
          skip: skip,
          order: { createdAt: 'ASC' }
        })) as Item[],
        total: res.length as number
      };
    }
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({
      where: { id: id },
      relations: ['cart', 'cart.user']
    });
    if (!item) {
      throw new NotFoundException('Такой товар не найден');
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const updatedData = await this.itemsRepository
      .createQueryBuilder('item')
      .update<Item>(Item, { ...updateItemDto })
      .where({ id: id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return updatedData.raw[0];
  }

  async remove(id: number) {
    return await this.itemsRepository.delete(id);
  }
}
