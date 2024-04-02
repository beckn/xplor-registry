import { Module } from '@nestjs/common'
import { ApiClient } from 'src/common/api-client'
import { RegistryController } from '../controller/registry.controller'
import { CredentialSchemaCreateService } from '../service/credential-schema-create.service'
import { CredentialSchemaDeleteService } from '../service/credential-schema-delete.service'
import { CredentialSchemaReadService } from '../service/credential-schema-read.service'
import { CredentialSchemaUpdateService } from '../service/credential-schema-update.service'
import { UserDidService } from '../service/user-did.service'
import { VerifiableCredentialCreateService } from '../service/verifiable-credential-create.service'
import { VerifiableCredentialReadService } from '../service/verifiable-credential-read.service'

@Module({
  imports: [ApiClient],
  controllers: [RegistryController],
  providers: [
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
