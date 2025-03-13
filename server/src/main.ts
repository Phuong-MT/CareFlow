import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('CareFlow')
    .setDescription('The careflow API description')
    .setVersion('1.0')
    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory,{
      //yamlDocumentUrl: '/api.yaml',
      jsonDocumentUrl: '/api.json',
    });     
  await app.listen(process.env.PORT , () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT}`);
  });
}
bootstrap();
