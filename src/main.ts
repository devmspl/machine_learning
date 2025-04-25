import { SwaggerUIExtended, MyHttpExceptionFilter } from '@app/common';
import { NestFactory, NestApplication } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as swaggerOtpions from './global/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import * as mainSetting from './global/main';
import { readFileSync } from 'fs';
import { join } from 'path';
// import * as express from 'express';                
import express from 'express';
const cluster = require('cluster');
const os = require('os');
import { ExpressAdapter } from '@nestjs/platform-express';

const totalCPUs = os.cpus().length;
console.log('totalCPUs====>>>>', totalCPUs);

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  console.log(`Worker ${process.pid} started`);

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const swaggerOptions = {
    description: swaggerOtpions.DESCRIPTION,
    version: swaggerOtpions.VERSION,
    title: swaggerOtpions.TITLE,
    path: swaggerOtpions.PATH,
  };

  async function bootstrap() {
    const is_https_server = process.env.SSL == 'true' ? true : false;

    let APP_OPTIONS = undefined;

    if (is_https_server) {
      APP_OPTIONS = {
        httpsOptions: {
          key: readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
          cert: readFileSync(process.env.SSL_CERT_PATH, 'utf8'),
        },
      };
    }

    const app = await NestFactory.create(AppModule, APP_OPTIONS);

    app.setGlobalPrefix(mainSetting.globalPrefix);

    app.enableCors({ methods: mainSetting.corsMethods });

    app.useGlobalFilters(new MyHttpExceptionFilter());

    app.useGlobalPipes(new ValidationPipe());

    app.useWebSocketAdapter(new IoAdapter(app));

    // (app as any).useStaticAssets(join(process.cwd(), 'public'));

    // const configService = app.get(ConfigService);

    // new SwaggerUIExtended(app as NestApplication, swaggerOptions).create();
    // app.use('/assets/files', express.static('assets/files'));

    // // Serve static assets from the 'public' folder
    // app.useStaticAssets(join(process.cwd(), 'public'));

    // // Serve static assets from the 'assets' folder with a '/assets' prefix
    // app.useStaticAssets(join(process.cwd(), 'assets'), { prefix: '/assets' });

    // Serve files from the 'assets/files' folder
    app.use(
      '/files',
      express.static(join(process.cwd(), 'files')),
    );

    app.use(
      '/excel_files', // The path to access files (http://localhost:1333/api/excel_files)
      express.static(join(process.cwd(), 'excel_files')), // Folder to serve files from
    );

    const configService = app.get(ConfigService);

    new SwaggerUIExtended(app as NestApplication, swaggerOptions).create();

    const port = configService.get<string>('PORT') || 3000;

    await app.listen(port);
  }

  bootstrap();
}


