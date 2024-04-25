import { Injectable } from '@nestjs/common';
import { CreateTodoDto, TodoQuery, UpdateTodoDto } from './types';
import { PrismaClient } from '@prisma/client';
import { pick } from 'lodash';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(cmd: TodoQuery) {
    return this.prisma.todo.findMany({
      where: {
        uid: cmd.uid,
        title: cmd.title ? { contains: cmd.title } : undefined,
        completed: cmd.completed !== null && cmd.completed !== undefined ? cmd.completed : undefined,
      },
      orderBy: {
        [cmd.sort]: cmd.order,
      },
      skip: (cmd.page - 1) * cmd.size,
      take: cmd.size,
    });
  }

  async create(cmd: CreateTodoDto) {
    return this.prisma.todo.create({
      data: cmd,
    });
  }

  async update(cmd: UpdateTodoDto) {
    return this.prisma.todo.update({
      where: pick(cmd, ['uid', 'id']),
      data: pick(cmd, ['title', 'completed']),
    });
  }

  async delete(uid: number, id: number) {
    return this.prisma.todo.delete({
      where: {
        uid,
        id,
      },
    });
  }
}
