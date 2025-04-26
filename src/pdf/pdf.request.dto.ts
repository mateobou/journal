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

  @IsString()
  readonly content: string;

  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly css: string;
}