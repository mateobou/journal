import { IsString, IsOptional } from 'class-validator';

export class PdfRequestDto {
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly subtitle: string;

  @IsString()
  readonly date: string;

  @IsString()
  readonly author: string;
  @IsOptional()

  @IsString()
  readonly content: string;

  @IsString()
  @IsOptional()
  readonly css: string;
}