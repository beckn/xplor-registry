// app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiClient } from './common/api-client'
import configuration from './config/env/env.config'
import { VerifiableCredentialModule } from './registry/module/verifiable-credential.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GrafanaLoggerService } from './grafana/service/grafana.service'
import { LoggingInterceptor } from './utils/logger-interceptor'
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
  providers: [
    AppService,
    GrafanaLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
