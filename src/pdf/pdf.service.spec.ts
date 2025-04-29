import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

jest.mock('fs');
jest.mock('puppeteer');

describe('PdfService', () => {
  let service: PdfService;

  const mockData = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    date: '2024-01-01',
    author: 'John Doe',
    content: 'Lorem ipsum dolor sit amet...',
    name: 'testfile',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should create a PDF and return the path', async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('<html>{{title}}</html>');

    const pageMock = {
      setContent: jest.fn(),
      pdf: jest.fn(),
    };

    const browserMock = {
      newPage: jest.fn().mockResolvedValue(pageMock),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(browserMock);

    const result = await service.createPdf({ ...mockData });

    expect(fs.readFileSync).toHaveBeenCalled(); // Le template est bien lu
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(pageMock.setContent).toHaveBeenCalled();
    expect(pageMock.pdf).toHaveBeenCalled();
    expect(result).toContain('.pdf');
  });
});
