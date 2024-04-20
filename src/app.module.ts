// app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiClient } from './common/api-client'
import configuration from './config/env/env.config'
import { VerifiableCredentialModule } from './registry/module/verifiable-credential.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ApiClient,
    VerifiableCredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
