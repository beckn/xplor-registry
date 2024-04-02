import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { SchemaStatusEnum } from 'src/common/constants/enums'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'
import { UpdateCredentialStatusRequestDto } from '../dto/update-credential-request.dto'
import { UpdateSchemaRequestDto } from '../dto/update-schema-request-body.dto'

@Injectable()
export class CredentialSchemaUpdateService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Updates the status of the schema to Deprecate, Publish, Revoke
   */
  async updateSchemaStatus(query: UpdateCredentialStatusRequestDto): Promise<StandardMessageResponse | any> {
    const statusRoute =
      query.status == SchemaStatusEnum.PUBLISH
        ? RequestRoutes.PUBLISH_SCHEMA
        : query.status == SchemaStatusEnum.DEPRECATE
        ? RequestRoutes.DEPRECATE_SCHEMA
        : query.status == SchemaStatusEnum.REVOKE
        ? RequestRoutes.REVOKE_SCHEMA
        : ''

    const templateRequest = await this.apiClient.put(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') +
        RequestRoutes.SCHEMA +
        statusRoute +
        `/${query.schemaId}/${query.schemaVersion}`,
    )

    if (templateRequest == null) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_SCHEMA)
    }

    return templateRequest
  }

  /**
   * Updates the schema properties
   */
  async updateSchemaProperties(requestBody: UpdateSchemaRequestDto): Promise<StandardMessageResponse | any> {
    const schemaRequest = await this.apiClient.put(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') +
        RequestRoutes.SCHEMA +
        `/${requestBody.schema.id}/${requestBody.schema.version}`,
      requestBody,
    )

    if (schemaRequest == null) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    return schemaRequest
  }
}
