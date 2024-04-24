import { Module } from '@nestjs/common'
import { ApiClient } from 'src/common/api-client'
import { GrafanaLoggerService } from 'src/grafana/service/grafana.service'
import { RegistryController } from 'src/registry/controller/registry.controller'
import { CredentialSchemaCreateService } from 'src/registry/service/credential-schema-create.service'
import { CredentialSchemaDeleteService } from 'src/registry/service/credential-schema-delete.service'
import { CredentialSchemaReadService } from 'src/registry/service/credential-schema-read.service'
import { CredentialSchemaUpdateService } from 'src/registry/service/credential-schema-update.service'
import { UserDidService } from 'src/registry/service/user-did.service'
import { VerifiableCredentialCreateService } from 'src/registry/service/verifiable-credential-create.service'
import { VerifiableCredentialReadService } from 'src/registry/service/verifiable-credential-read.service'

@Module({
  imports: [ApiClient],
  controllers: [RegistryController],
  providers: [
    GrafanaLoggerService,
    VerifiableCredentialCreateService,
    VerifiableCredentialReadService,
    UserDidService,
    ApiClient,
    CredentialSchemaCreateService,
    CredentialSchemaReadService,
    CredentialSchemaUpdateService,
    CredentialSchemaDeleteService,
  ],
})
export class VerifiableCredentialModule {}
