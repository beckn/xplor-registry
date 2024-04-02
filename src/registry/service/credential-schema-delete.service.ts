import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'

@Injectable()
export class CredentialSchemaDeleteService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}
  /**
   * Deletes the template using the templateId.
   */
  async deleteCredentialTemplate(templateId: string): Promise<StandardMessageResponse | any> {
    const templateRequest = await this.apiClient.delete(
      this.configService.get('SUNBIRD_SCHEMA_SERVICE_URL') + RequestRoutes.TEMPLATE + `/${templateId}`,
    )

    if (templateRequest == null) {
      throw new NotFoundException(RegistryErrors.TEMPLATE_NOT_FOUND)
    }

    return templateRequest
  }
}
