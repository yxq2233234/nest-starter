import { Body, Controller, Delete, ParseIntPipe, Post, Put, Query, Session } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, TodoQuery, UpdateTodoDto } from './types';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '../auth/auth';
import { AppSession } from '../auth/types';

@Auth()
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: '查询列表' })
  @Post('list')
  async list(@Session() session: AppSession, @Body() cmd: TodoQuery) {
    cmd.uid = session.userId;
    return this.todoService.list(cmd);
  }

  @ApiOperation({ summary: '创建' })
  @Post()
  async create(@Session() session: AppSession, @Body() cmd: CreateTodoDto) {
    cmd.uid = session.userId;
    return this.todoService.create(cmd);
  }

  @ApiOperation({ summary: '更新' })
  @Put('/:id')
  async update(@Session() session: AppSession, @Query('id', ParseIntPipe) id: number, @Body() cmd: UpdateTodoDto) {
    cmd.uid = session.userId;
    cmd.id = id;
    return this.todoService.update(cmd);
  }

  @ApiOperation({ summary: '删除' })
  @Delete('/:id')
  async delete(@Session() session: AppSession, @Query('id', ParseIntPipe) id: number) {
    return this.todoService.delete(session.userId, id);
  }
}
