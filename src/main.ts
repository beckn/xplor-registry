/*
Written by Bhaskar Kauraa
Date: 15 April, 2024
*/

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
async function run() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api/v1')
  const config = new DocumentBuilder()
    .setTitle('Xplor Registry')
    .setDescription('Registry layer for Xplore to issue, fetch and verify Credentials using Sunbird RC Layer.')
    .setVersion('0.0.1-alpha')
    .addTag('Registry')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1', app, document)
  await app.listen(3000)
}

run()
