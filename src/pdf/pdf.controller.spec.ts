import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { PdfRequestDto } from './pdf.request.dto';

describe('PdfController', () => {
  let pdfController: PdfController;
  let pdfService: PdfService;

  const mockPdfData: PdfRequestDto = {
    title: 'Mock Title',
    subtitle: 'Mock Subtitle',
    date: '2025-04-18',
    author: 'Jane Doe',
    content: 'This is a sample article content.',
    name: 'mock-article',
    css: ''
  };

  const mockPdfPath = 'pdf/mock-article-123456789.pdf';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [
        {
          provide: PdfService,
          useValue: {
            createPdf: jest.fn().mockResolvedValue(mockPdfPath),
          },
        },
      ],
    }).compile();

    pdfController = moduleRef.get<PdfController>(PdfController);
    pdfService = moduleRef.get<PdfService>(PdfService);
  });

  describe('generatePdf()', () => {
    it('should call PdfService.createPdf and return the PDF path', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const result = await pdfController.generatePdf(mockPdfData, mockResponse);

      expect(pdfService.createPdf).toHaveBeenCalledWith({ ...mockPdfData });
      expect(result).toBe(mockPdfPath);
    });
  });
});
