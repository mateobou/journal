import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import puppeteer, { PaperFormat } from 'puppeteer';

@Injectable()
export class PdfService {
  async createPdf(dataArray: Array<{
    title: string;
    subtitle: string;
    date: string;
    author: string;
    content: string;
  }>): Promise<StreamableFile> {
    const templateHtml = fs.readFileSync(path.join(process.cwd(), "src/templates/newspaper/template.html"), 'utf8');
    const template = handlebars.compile(templateHtml);
    const css = fs.readFileSync(path.join(process.cwd(), 'src/templates/newspaper/styles.css'), 'utf8');
    const cssPath = "src/templates/newspaper/styles.css";

    const allArticlesHtml = dataArray.map(data => {
      return template({ ...data, styles: cssPath });
    }).join('');

    const fullHtml = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${allArticlesHtml}</body>
      </html>
    `;

    const pdfDir = path.join(process.cwd(), 'pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const milis = new Date().getTime();
    const pdfPath = path.join(pdfDir, `newspaper-${milis}.pdf`);
    const format: PaperFormat = 'A4';

    const options = {
      displayHeaderFooter: false,
      margin: { top: "20px", bottom: "20px" },
      printBackground: true,
      path: pdfPath,
      format: format,
    };

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    await page.pdf(options);
    await browser.close();

    const file = fs.createReadStream(pdfPath);
    return new StreamableFile(file);
  }
}
