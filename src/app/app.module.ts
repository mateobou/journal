import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfController } from 'src/pdf/pdf.controller';
import { PdfService } from 'src/pdf/pdf.service';
import { LoggerMiddleware } from 'src/middleware/exceptionFilter';

@Module({
  imports: [],
  controllers: [AppController, PdfController],
  providers: [AppService, PdfService],
})
export class AppModule {
  configure(consomer:MiddlewareConsumer){
    consomer.apply(LoggerMiddleware).forRoutes('*')
  }
}
