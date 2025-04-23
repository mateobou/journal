import { Module } from '@nestjs/common';
import { AppController } from './pdf.controller';
import { AppService } from './pdf.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
