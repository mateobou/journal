import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async createPdf(data: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
    content: string;
    name: string;
	css: string;
  }): Promise<StreamableFile> {
    const templateHtml = fs.readFileSync(path.join(process.cwd(), "src/templates/newspaper/template.html"), 'utf8');
    const template = handlebars.compile(templateHtml);
    const css = fs.readFileSync(path.join(process.cwd(), 'src/templates/newspaper/styles.css'), 'utf8');
	const cssPath = "src/templates/newspaper/styles.css"
    const html = template({ ...data, styles: cssPath });
    const pdfDir = path.join(process.cwd(), 'pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
	
    const milis = new Date().getTime();
    const pdfPath = path.join(pdfDir, `${data.name}-${milis}.pdf`);

    const options = {
      width: '1230px',
      headerTemplate: "<p></p>",
      footerTemplate: "<p></p>",
      displayHeaderFooter: false,
      margin: {
        top: "10px",
        bottom: "30px"
      },
      printBackground: true,
      path: pdfPath
    };

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: 'networkidle0'
    });

    await page.pdf(options);
    await browser.close();

    const file = fs.createReadStream(pdfPath);
    return new StreamableFile(file);
  }
}