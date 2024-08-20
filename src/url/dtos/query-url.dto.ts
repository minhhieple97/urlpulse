import { IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryUrlDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  priority: number;
}
