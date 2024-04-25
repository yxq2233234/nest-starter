import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Pageable<T> {
  @ApiProperty()
  @IsArray()
  items: T[];
  @ApiProperty()
  @IsNumber()
  total: number;
}

export class PageableOptions {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  size?: number;
}

export interface SortableOptions {
  sort?: string;
  order?: 'asc' | 'desc';
}
