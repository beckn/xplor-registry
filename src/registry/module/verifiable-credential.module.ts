import { Module } from '@nestjs/common'
import { ApiClient } from 'src/common/api-client'
import { RegistryController } from '../controller/registry.controller'
import { CredentialSchemaService } from '../service/credential-schema.service'
import { UserDidService } from '../service/user-did.service'
import { VerifiableCredentialService } from '../service/verifiable-credential.service'

@Module({
  imports: [ApiClient],
  controllers: [RegistryController],
  providers: [VerifiableCredentialService, UserDidService, ApiClient, CredentialSchemaService],
})
export class VerifiableCredentialModule {}
