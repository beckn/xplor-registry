import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { SchemaStatusEnum } from 'src/common/constants/enums'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { UpdateCredentialStatusRequestDto } from 'src/registry/dto/update-credential-request.dto'
import { UpdateSchemaRequestDto } from 'src/registry/dto/update-schema-request-body.dto'

@Injectable()
export class CredentialSchemaUpdateService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Updates the status of the schema to Deprecate, Publish, Revoke
   */
  async updateSchemaStatus(query: UpdateCredentialStatusRequestDto): Promise<any> {
    let statusRoute = ''
    if (query.status === SchemaStatusEnum.PUBLISH) {
      statusRoute = RequestRoutes.PUBLISH_SCHEMA
    } else if (query.status === SchemaStatusEnum.DEPRECATE) {
      statusRoute = RequestRoutes.DEPRECATE_SCHEMA
    } else if (query.status == SchemaStatusEnum.REVOKE) {
      statusRoute = RequestRoutes.REVOKE_SCHEMA
    }

    const templateRequest = await this.apiClient.put(
      this.configService.get(RequestRoutes.SUNBIRD_SCHEMA_SERVICE_URL) +
        RequestRoutes.SCHEMA +
        statusRoute +
        `/${query.schemaId}/${query.schemaVersion}`,
    )

    if (!templateRequest) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_SCHEMA)
    }

    return templateRequest
  }

  /**
   * Updates the schema properties
   */
  async updateSchemaProperties(requestBody: UpdateSchemaRequestDto): Promise<any> {
    const schemaRequest = await this.apiClient.put(
      this.configService.get(RequestRoutes.SUNBIRD_SCHEMA_SERVICE_URL) +
        RequestRoutes.SCHEMA +
        `/${requestBody.schema.id}/${requestBody.schema.version}`,
      requestBody,
    )

    if (!schemaRequest) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    return schemaRequest
  }
}
