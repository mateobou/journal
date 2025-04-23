import { Controller, Post, Res, Body, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import path from 'path';
import * as fs from 'fs';

@Controller("/api/")
export class PdfController {
  constructor(private readonly appService: PdfService) {}


  @Post('generate-pdf')
  async generatePdf(@Body() data: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
    content: string;
    name: string;
  }, @Res({ passthrough: true }) res: Response) {
    if (!data.title || !data.subtitle || !data.date || !data.author || !data.content || !data.name) {

      data = {
        title: 'Default Title',
        subtitle: 'Default Subtitle',
        date: new Date().toISOString(),
        author: 'Default Author',
        content: 'Default Content',
        name: 'Default Name'
      }
    }

    const pdfStream = await this.appService.createPdf({ ...data, css: '' });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${data.name}.pdf"`,
    });

    return pdfStream;
  }

  @Get("pdf")
  async getPdf(@Query('file') fileName: string, @Res() res: Response) {
    const pdfPath = path.join(process.cwd(), 'pdf', fileName);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send('PDF not found');
    }

    const file = fs.createReadStream(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    file.pipe(res);
  }
}
