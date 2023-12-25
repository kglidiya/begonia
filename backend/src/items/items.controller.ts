import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.emun';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiQuery } from '@nestjs/swagger';
import { Type } from './entities/type.emun';


@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @ApiQuery({name: 'type'})
  @ApiQuery({name: 'page'})
  @ApiQuery({name: 'resultPerPage'})
  @Get()
  findAll(@Query() query: {type: Type, page: number, resultPerPage: number}) {
    return this.itemsService.findAll(query.type, query.page, query.resultPerPage);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
