import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

async function init() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Api.Identity')
    .setDescription('Api.Identity')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('env.port', 3000);
  console.log(`
          ⚡ API.IDENTITY
          🚀 Server is up and running!                            
          🌍 URL: http://localhost:${port}                       
          📘 Swagger Docs: http://localhost:${port}/api          
                                                                   
          Ready to handle requests. Let's go! 💻                 
  `);

  await app.listen(port);
}

init();
