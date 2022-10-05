import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentResponseDto {
  @IsNotEmpty()
  @IsString()
  topicId: string;
}

export class CommentSearchDto {
  @IsOptional()
  @IsString()
  topicId: string;
}
