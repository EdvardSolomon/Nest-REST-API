import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Nest-REST-API')
    .setDescription('RESTful API for management of users and their posts.')
    .setVersion('1.0')
    .addSecurity('JWT', {
      type: 'http',
      scheme: 'bearer',
    })
    .addTag('REST-API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3333);
}
bootstrap();
