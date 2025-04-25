import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestApplication } from '@nestjs/core';

interface IOptions {
  title: string;
  description: string;
  version: string;
  path: string;
  css?: string;
}

export class SwaggerUIExtended {
  private readonly APP: NestApplication;
  private options: IOptions;

  constructor(app: NestApplication, options: IOptions) {
    this.APP = app;
    this.options = options;
  }

  public create(): void | never {
    const config = new DocumentBuilder()
      .setTitle(this.options.title)
      .setDescription(this.options.description)
      .setVersion(this.options.version)
      .build();

    const swagger_design = {
      customCss: this.options.css || '.swagger-ui .topbar { display: none }',
      customSiteTitle: this.options.title,
    };

    const document = SwaggerModule.createDocument(this.APP, config);
    SwaggerModule.setup(this.options.path, this.APP, document, swagger_design);
  }
}
