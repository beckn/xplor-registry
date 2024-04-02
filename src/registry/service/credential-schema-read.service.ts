import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'
import { GetSchemaDetailsRequestDto } from '../dto/get-schema-details-request.dto'

@Injectable()
export class CredentialSchemaReadService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Returns the Schema details with the entered schema id and the version.
   */
  async getCredentialSchemaByIdAndVersion(query: GetSchemaDetailsRequestDto): Promise<StandardMessageResponse | any> {
    const schemaRequest = await this.apiClient.get(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') +
        RequestRoutes.SCHEMA +
        `/${query.schemaId}/${query.schemaVersion}`,
    )

    if (schemaRequest == null) {
      throw new NotFoundException(RegistryErrors.SCHEMA_NOT_FOUND)
    }

    return schemaRequest
  }

  /**
   * Returns the Template details with the entered templateId.
   */
  async getCredentialTemplateById(templateId: string): Promise<StandardMessageResponse | any> {
    const templateRequest = await this.apiClient.get(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') + RequestRoutes.TEMPLATE + `/${templateId}`,
    )

    if (templateRequest == null) {
      throw new NotFoundException(RegistryErrors.TEMPLATE_NOT_FOUND)
    }

    return templateRequest
  }
}
