import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfController } from 'src/pdf/pdf.controller';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [],
  controllers: [AppController, PdfController],
  providers: [AppService, PdfService],
})
export class AppModule {}
