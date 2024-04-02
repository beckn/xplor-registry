import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'
import { CreateSchemaRequestDto } from '../dto/create-schema-request-body.dto'
import { CreateTemplateRequestBodyDto } from '../dto/create-template-request-body.dto'

@Injectable()
export class CredentialSchemaCreateService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Create a Schema for the credential for your VCs. This communicates with Sunbird RC layer to generate VC Schema
   */
  async createSchema(requestBody: CreateSchemaRequestDto): Promise<StandardMessageResponse | any> {
    const schemaRequest = await this.apiClient.post(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') + RequestRoutes.SCHEMA,
      requestBody,
    )
    if (schemaRequest == null) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    return schemaRequest
  }

  /**
   * Create a Schema for the credential for your VCs. This communicates with Sunbird RC layer to generate VC Schema
   */
  async createCredentialSchemaTemplate(
    templateBody: CreateTemplateRequestBodyDto,
  ): Promise<StandardMessageResponse | any> {
    const schemaRequest = await this.apiClient.post(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') + RequestRoutes.TEMPLATE,
      templateBody,
    )

    if (schemaRequest == null) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_TEMPLATE)
    }

    return schemaRequest
  }
}
