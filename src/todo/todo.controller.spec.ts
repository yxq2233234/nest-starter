import { TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { createTestApp } from '../test';
import { PrismaClient } from '@prisma/client';
import { AppSession } from '../auth/types';

describe('TodoController', () => {
  let module: TestingModule;
  let controller: TodoController;
  let prisma: PrismaClient;
  let todoId: number;

  const session1: AppSession = {
    userId: 1,
    token: 'test',
    mobile: '12345678901',
    expires: 0,
  };

  const session2: AppSession = {
    userId: 2,
    token: 'test',
    mobile: '12345678902',
    expires: 0,
  };

  beforeAll(async () => {
    module = await createTestApp();

    controller = module.get<TodoController>(TodoController);
    prisma = module.get<PrismaClient>(PrismaClient);

    await prisma.$executeRaw`TRUNCATE TABLE "Todo"`;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create todo', async () => {
    const todo = await controller.create(session1, { title: 'test1', uid: undefined });
    expect(todo.title).toBe('test1');
    todoId = todo.id;
    await controller.create(session1, { title: 'test2', uid: undefined });
    await controller.create(session1, { title: 'test3', uid: undefined });
    await controller.create(session1, { title: 'test4', uid: undefined });
    await controller.create(session1, { title: 'test5', uid: undefined });
    await controller.create(session2, { title: 'test6', uid: undefined });
    await controller.create(session2, { title: 'test7', uid: undefined });
    await controller.create(session2, { title: 'test8', uid: undefined });
  });

  it('should update todo', async () => {
    await controller.update(session1, todoId, { title: 'test updated', completed: true, uid: undefined, id: undefined });
  });

  it('should list todos', async () => {
    const todos = await controller.list(session1, {
      page: 1,
      size: 10,
      sort: 'id',
      order: 'asc',
      uid: undefined,
    });
    expect(todos.length).toBe(5);
    expect(todos[0].title).toBe('test updated');
    expect(todos[0].id).toBe(todoId);

    const todos2 = await controller.list(session2, {
      page: 1,
      size: 10,
      sort: 'id',
      order: 'asc',
      uid: undefined,
    });
    expect(todos2.length).toBe(3);

    const todos3 = await controller.list(session1, {
      page: 1,
      size: 10,
      sort: 'id',
      order: 'asc',
      title: 'test2',
      uid: undefined,
    });
    expect(todos3.length).toBe(1);

    const todos4 = await controller.list(session1, {
      page: 1,
      size: 10,
      sort: 'id',
      order: 'desc',
      completed: true,
      uid: undefined,
    });
    expect(todos4.length).toBe(1);
  });

  it('should delete todo', async () => {
    await controller.delete(session1, todoId);
    const todos = await controller.list(session1, {
      page: 1,
      size: 10,
      sort: 'id',
      order: 'asc',
      uid: undefined,
    });
    expect(todos.length).toBe(4);
  });
});
