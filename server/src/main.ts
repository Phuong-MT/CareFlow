import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from './utils/ws-adapter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }),
  );
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3030', 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type, Authorization',
  });
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
  //app.useWebSocketAdapter(new WsAdapter(app));      
  await app.listen(process.env.PORT , () => {
    console.log(`Our server is listening on PORT: ${process.env.PORT}`);
  });
}
bootstrap();
