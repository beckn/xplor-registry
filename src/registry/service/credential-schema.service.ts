import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiClient } from 'src/common/api-client'
import { SchemaStatusEnum } from 'src/common/constants/enums'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'
import { CreateSchemaRequestDto } from '../dto/create-schema-request-body.dto'
import { CreateTemplateRequestBodyDto } from '../dto/create-template-request-body.dto'
import { GetSchemaDetailsRequestDto } from '../dto/get-schema-details-request.dto'
import { UpdateCredentialStatusRequestDto } from '../dto/update-credential-request.dto'
import { UpdateSchemaRequestDto } from '../dto/update-schema-request-body.dto'

@Injectable()
export class CredentialSchemaService {
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
    console.log('booodyy', requestBody)
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
