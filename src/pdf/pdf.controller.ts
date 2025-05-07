import { Controller, Post, Res, Body, Get, Query, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import path from 'path';
import * as fs from 'fs';
import { PdfRequestDto } from './pdf.request.dto';

@Controller("/api/")
export class PdfController {
  constructor(private readonly appService: PdfService) {}

  @Post('generate-pdf')
  async generatePdf(
    @Body() pdfRequest: { data: PdfRequestDto[] },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!pdfRequest?.data || !Array.isArray(pdfRequest.data) || pdfRequest.data.length === 0) {
      throw new BadRequestException('Missing or invalid PDF request data.');
    }

    try {
      const pdfStream = await this.appService.createPdf(pdfRequest?.data);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="newspaper.pdf"`,
      });

      return pdfStream;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Failed to generate PDF.');
    }
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
