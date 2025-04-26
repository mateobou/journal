import { Controller, Post, Res, Body, Get, Query, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { PdfService } from './pdf.service';
import path from 'path';
import * as fs from 'fs';
import { PdfRequestDto } from './pdf.request.dto';

export type PdfData = {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  content: string;
  name: string;
  css: string;
}

export interface PdfRequest extends Request {
  body: {
    data: PdfData;
  };
}

@Controller("/api/")
export class PdfController {
  constructor(private readonly appService: PdfService) {}

  @Post('generate-pdf')
  async generatePdf(
    @Body() pdfRequest: PdfRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    let data: PdfData;
    
    if (!pdfRequest?.title || !pdfRequest?.author || !pdfRequest?.content) {
      data = {
        title: 'YouTube is everything and everything is YouTube',
        subtitle: '20 years in, YouTube is a dominant entertainment force. Now it\'s coming for just about every way you spend your time.',
        date: new Date().toISOString(),
        author: 'David Pierce',
        content: 'Looking back, the original idea behind YouTube seems almost quaint. The mythic founding story goes like this: in January of 2005, two PayPal employees, Chad Hurley and Steve Chen, were at a party. People were taking photos and videos on their digital cameras. Sharing photos was easy, sharing video was anything but. "People have different video types, video codecs they have to download, video software," Chen said on Charlie Rose in 2006. He and Hurley had a sense that as digital cameras and cameraphones became ubiquitous, more people were going to want to share their footage. "We tried to simplify the process, to make it as easy as possible to share these videos online." By the end of the year, their simple platform was already a huge hit. \n Fast forward to today, the 20th anniversary of the first-ever YouTube video upload, and the numbers have become so big they\'re basically meaningless. Three and a half billion people watch YouTube every month, according to one study. Google\'s earnings show it brought in about $36 billion in ad revenue alone last year. YouTube gets 50 percent more viewership than Netflix, and about as much as Disney, Prime Video, Peacock, and Paramount Plus combined — and that only counts people watching YouTube on their TVs. YouTube is by most measurements the second most popular search engine on the internet (after Google), and the second most popular social network (after Facebook). It\'s the most popular service for both music and podcast listening. It\'s the second most popular page on Wikipedia, for some reason. It\'s for cat videos and Oscar winners. YouTube knows no bounds. \n Ahead of the 20th anniversary, I talked to a number of people inside YouTube about the state of the platform. I asked them all a variant of the same question: what is YouTube? It\'s not just a video-sharing platform anymore. It\'s podcasts and videos and music and games and group chats and a thousand other things. What has YouTube become? And what\'s the plan going forward? \n Over and over, I heard the same thing: YouTube is more complicated and more diffuse than ever, and it\'s definitely no longer a singular platform. But the idea at the core of the thing hasn\'t changed at all. "The secret of YouTube was never really a secret," said Scott Silver, a product and engineering leader at YouTube who has been at Google since the days of Google Video. (Google Video, you definitely don\'t need to remember, was Google\'s attempt to build a video-sharing platform before it gave up and bought YouTube for $1.65 billion in 2006.) "It\'s just that if there\'s a giant collection of videos somewhere, and you figure out which ones to show people, and then they watch them, and you\'re able to pay the people who make that collection of videos to make more of them, then there\'s more stuff to choose from. It compounds on itself. That\'s the grand unified theory of YouTube, right there, and it has been compounding on itself for two decades. It has made YouTube enormous, and enormously powerful. But the job\'s not done: there are always new formats, new content types, and new devices to reckon with. YouTube\'s ambitions are only getting bigger, too — the company clearly aspires to be the size of the entertainment industry, or maybe even be the entertainment industry. That is going to require history\'s largest video collection to get much, much larger. \n The many faces of YouTube \n When I ask Brian Albert, a managing director on YouTube\'s advertising team, to explain YouTube to me the way he explains it to clients, he breaks the platform into three separate categories. There\'s streaming, the high-end stuff that competes with Netflix and the rest. There\'s also social video, in YouTube\'s case mostly meaning Shorts, up against TikTok and Reels. And there\'s what Albert calls "straight online video," the kind of creator-led mid- and long-form video you really only find on YouTube. "We have competitors across the board," Albert said, "but there\'s no single competitor who plays in each of those three lanes."',
        name: 'Default Name',
        css: ''
      };
    } else {
      data = {
        title: pdfRequest.title,
        subtitle: pdfRequest.subtitle,
        date: pdfRequest.date,
        author: pdfRequest.author,
        content: pdfRequest.content,
        name: pdfRequest.name,
        css: pdfRequest.css || ''
      };
    }

    const pdfStream = await this.appService.createPdf(data);

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
