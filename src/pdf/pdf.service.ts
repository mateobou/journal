import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import puppeteer, { PaperFormat } from 'puppeteer';

@Injectable()
export class PdfService {
  async createPdf(data: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
    content: string;
    name: string;
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

    const headerTemplate = handlebars.compile(`
      <style>
        .pdf-header {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 10px;
          color: white;
          background-color: black;
          width: 100%;
          height: 60px;
          padding: 8px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
        }
        .pdf-header .headline {
          font-size: 12px;
          font-weight: bold;
        }
        .pdf-header .subheadline {
          font-style: italic;
          font-size: 10px;
          margin-top: 2px;
        }
        .pdf-header .article-meta {
          font-size: 9px;
          margin-top: 2px;
          color: lightgray;
        }
      </style>
      <div class="pdf-header">
        <div class="headline">{{title}}</div>
        <div class="subheadline">{{subtitle}}</div>
        <div class="article-meta">{{date}} – {{author}}</div>
      </div>
    `);
    
    const footerTemplate = handlebars.compile(`
      <style>
        .pdf-footer {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 10px;
          color: gray;
          width: 100%;
          height: 40px;
          padding: 10px 0;
          text-align: center;
          box-sizing: border-box;
          border-top: 1px solid lightgray;
        }
        .pdf-footer .page-info {
          font-style: italic;
          font-size: 10px;
          color: dimgray;
        }
      </style>
      <div class="pdf-footer">
        <div class="page-info">
          Page <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      </div>
    `);
      
    const milis = new Date().getTime();
    const pdfPath = path.join(pdfDir, `${data.name}-${milis}.pdf`);
    const format: PaperFormat = 'A4';
    const options = {
      displayHeaderFooter: true,
      margin: {
        top: "80px",   
        bottom: "60px" 
      },
      printBackground: true,
      path: pdfPath,
      format: format,
      headerTemplate: headerTemplate(data),
      footerTemplate: footerTemplate(data),
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