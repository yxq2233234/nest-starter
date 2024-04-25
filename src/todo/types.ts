import { PageableOptions, SortableOptions } from '../utils/page-sort';
import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TodoQuery extends PageableOptions implements SortableOptions {
  @ApiProperty()
  @IsOptional()
  title?: string;
  @ApiProperty()
  @IsOptional()
  completed?: boolean;
  @ApiProperty()
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'completed', 'id'])
  sort?: 'createdAt' | 'updatedAt' | 'completed' | 'id';
  @ApiProperty()
  @IsOptional()
  order?: 'asc' | 'desc';

  uid: number;
}

export class CreateTodoDto {
  @ApiProperty()
  title: string;

  uid: number;
}

export class UpdateTodoDto extends CreateTodoDto {
  @ApiProperty()
  completed: boolean;

  id: number;
}

export class TodoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  title: string;
}
