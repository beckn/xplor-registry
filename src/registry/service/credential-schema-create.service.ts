import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { CreateSchemaRequestDto } from 'src/registry/dto/create-schema-request-body.dto'
import { CreateTemplateRequestBodyDto } from 'src/registry/dto/create-template-request-body.dto'

@Injectable()
export class CredentialSchemaCreateService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Create a Schema for the credential for your VCs. This communicates with Sunbird RC layer to generate VC Schema
   */
  async createSchema(requestBody: CreateSchemaRequestDto): Promise<any> {
    const schemaRequest = await this.apiClient.post(
      this.configService.get(RequestRoutes.SUNBIRD_SCHEMA_SERVICE_URL) + RequestRoutes.SCHEMA,
      requestBody,
    )
    if (!schemaRequest) {
      throw new BadRequestException(RegistryErrors.SCHEMA_CREATE_ERROR)
    }

    return schemaRequest
  }

  /**
   * Create a Schema for the credential for your VCs. This communicates with Sunbird RC layer to generate VC Schema
   */
  async createCredentialSchemaTemplate(templateBody: CreateTemplateRequestBodyDto): Promise<any> {
    const schemaRequest = await this.apiClient.post(
      this.configService.get(RequestRoutes.SUNBIRD_SCHEMA_SERVICE_URL) + RequestRoutes.TEMPLATE,
      templateBody,
    )

    if (!schemaRequest) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_TEMPLATE)
    }

    return schemaRequest
  }
}
