import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}