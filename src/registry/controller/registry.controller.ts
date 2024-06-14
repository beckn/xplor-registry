import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  CREATE_CREDENTIAL_SCHEMA_API,
  CREATE_CREDENTIAL_TEMPLATE_API,
  DELETE_CREDENTIAL_TEMPLATE_API,
  GENERATE_USER_DID_API,
  GET_CREDENTIAL_API,
  GET_CREDENTIAL_SCHEMA_BY_ID_API,
  GET_CREDENTIAL_TEMPLATE_API,
  ISSUE_CREDENTIAL_API,
  SELF_ISSUE_CREDENTIAL_API,
  UPDATE_SCHEMA_PROPERTIES_API,
  UPDATE_SCHEMA_STATUS_API,
  VERIFY_CREDENTIAL_API,
} from 'src/common/constants/api-documentation'
import { ApiRoutes } from 'src/common/constants/api-routes'
import { ApiFileMimetype } from 'src/common/constants/file-mimetype'
import { CreateSchemaRequestDto } from 'src/registry/dto/create-schema-request-body.dto'
import { CreateTemplateRequestBodyDto } from 'src/registry/dto/create-template-request-body.dto'
import { CreateUserDIDRequestDto } from 'src/registry/dto/create-user-did-request.dto'
import { GetSchemaDetailsRequestDto } from 'src/registry/dto/get-schema-details-request.dto'
import { IssueCredentialRequestDto } from 'src/registry/dto/issue-credential-status-request.dto'
import { UpdateCredentialStatusRequestDto } from 'src/registry/dto/update-credential-request.dto'
import { UpdateSchemaRequestDto } from 'src/registry/dto/update-schema-request-body.dto'
import { IssueCredentialRequestEntityDto } from 'src/registry/entity/issue-credential-request.entity'
import { MessageResponseEntity } from 'src/registry/entity/message-response.entity'
import { SchemaDetailsResponseEntity } from 'src/registry/entity/schema-details-response.entity'
import { TemplateDetailsResponseEntity } from 'src/registry/entity/template-details-response.entity'
import { CredentialSchemaCreateService } from 'src/registry/service/credential-schema-create.service'
import { CredentialSchemaDeleteService } from 'src/registry/service/credential-schema-delete.service'
import { CredentialSchemaReadService } from 'src/registry/service/credential-schema-read.service'
import { CredentialSchemaUpdateService } from 'src/registry/service/credential-schema-update.service'
import { UserDidService } from 'src/registry/service/user-did.service'
import { VerifiableCredentialCreateService } from 'src/registry/service/verifiable-credential-create.service'
import { VerifiableCredentialReadService } from 'src/registry/service/verifiable-credential-read.service'
import { CreateCredentialRequestDto } from '../dto/create-credential-request.dto'

@ApiTags('Registry')
@Controller('registry')
export class RegistryController {
  constructor(
    private readonly userDidService: UserDidService,
    private readonly schemaCreateService: CredentialSchemaCreateService,
    private readonly schemaReadService: CredentialSchemaReadService,
    private readonly schemaUpdateService: CredentialSchemaUpdateService,
    private readonly schemaDeleteService: CredentialSchemaDeleteService,
    private readonly vcCreateService: VerifiableCredentialCreateService,
    private readonly vcReadService: VerifiableCredentialReadService,
  ) {}

  /**
   * Generates a new user DID.
   * @param didRequest The request body containing data required to generate the DID.
   * @returns The generated user DID if successful.
   */
  @Post(ApiRoutes.GENERATE_USER_DID)
  @ApiOperation({
    summary: GENERATE_USER_DID_API.summary,
    description: GENERATE_USER_DID_API.description,
  })
  @ApiBody({ type: CreateUserDIDRequestDto })
  @ApiResponse({
    status: GENERATE_USER_DID_API.successResponseCode,
    description: GENERATE_USER_DID_API.successResponseMessage,
  })
  async generateUserDid(@Body() didRequest: CreateUserDIDRequestDto) {
    return await this.userDidService.generateUserDid(didRequest)
  }

  /**
   * Create a Schema for the credential for your VCs. This schema contains the subject details of the VC like FullName, CourseName etc.
   * @body body The request body containing data required to create the credential Schema.
   * @returns The result of the api would be the details of the created Schema.
   */
  @Post(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: CREATE_CREDENTIAL_SCHEMA_API.summary,
    description: CREATE_CREDENTIAL_SCHEMA_API.description,
  })
  @ApiResponse({
    status: CREATE_CREDENTIAL_SCHEMA_API.successResponseCode,
    description: CREATE_CREDENTIAL_SCHEMA_API.successResponseMessage,
    type: SchemaDetailsResponseEntity,
  })
  async createCredentialSchema(@Body() body: CreateSchemaRequestDto) {
    return await this.schemaCreateService.createSchema(body)
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Get(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: GET_CREDENTIAL_SCHEMA_BY_ID_API.summary,
    description: GET_CREDENTIAL_SCHEMA_BY_ID_API.description,
  })
  @ApiResponse({
    status: GET_CREDENTIAL_SCHEMA_BY_ID_API.successResponseCode,
    description: GET_CREDENTIAL_SCHEMA_BY_ID_API.successResponseMessage,
    type: SchemaDetailsResponseEntity,
  })
  async getCredentialSchemaByIdAndVersion(@Query() queryParams: GetSchemaDetailsRequestDto) {
    return await this.schemaReadService.getCredentialSchemaByIdAndVersion(queryParams)
  }

  /**
   * Updates the status of the schema to Deprecate, Publish, Revoke.
   * @body didRequest The request params containing schemaId and schemaVersion, stauts to update Schema
   * @returns The result of the api would be the details of the updated Schema.
   */
  @Patch(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: UPDATE_SCHEMA_STATUS_API.summary,
    description: UPDATE_SCHEMA_STATUS_API.description,
  })
  @ApiResponse({
    status: UPDATE_SCHEMA_STATUS_API.successResponseCode,
    description: UPDATE_SCHEMA_STATUS_API.successResponseMessage,
    type: SchemaDetailsResponseEntity,
  })
  async updateSchemaStatus(@Body() body: UpdateCredentialStatusRequestDto) {
    return await this.schemaUpdateService.updateSchemaStatus(body)
  }

  /**
   * Updates the Schema properties and context
   * @body didRequest The request params containing payload to update Schema same as the create Schema.
   * @returns The result of the api would be the details of the updated Schema.
   */
  @Put(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: UPDATE_SCHEMA_PROPERTIES_API.summary,
    description: UPDATE_SCHEMA_PROPERTIES_API.description,
  })
  @ApiResponse({
    status: UPDATE_SCHEMA_PROPERTIES_API.successResponseCode,
    description: UPDATE_SCHEMA_PROPERTIES_API.successResponseMessage,
    type: SchemaDetailsResponseEntity,
  })
  async updateSchemaProperties(@Body() body: UpdateSchemaRequestDto) {
    return await this.schemaUpdateService.updateSchemaProperties(body)
  }

  /**
   * Create Schema Template to render the document of the VC in pdf, html format.
   * @body The body takes html template of the Credential Schema.
   * @returns The result of the api would be the details of the created Template
   */
  @Post(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: CREATE_CREDENTIAL_TEMPLATE_API.summary,
    description: CREATE_CREDENTIAL_TEMPLATE_API.description,
  })
  @ApiResponse({
    status: CREATE_CREDENTIAL_TEMPLATE_API.successResponseCode,
    description: CREATE_CREDENTIAL_TEMPLATE_API.successResponseMessage,
    type: TemplateDetailsResponseEntity,
  })
  async createCredentialSchemaTemplate(@Body() templateBody: CreateTemplateRequestBodyDto) {
    return await this.schemaCreateService.createCredentialSchemaTemplate(templateBody)
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Get(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: GET_CREDENTIAL_TEMPLATE_API.summary,
    description: GET_CREDENTIAL_TEMPLATE_API.description,
  })
  @ApiResponse({
    status: GET_CREDENTIAL_TEMPLATE_API.successResponseCode,
    description: GET_CREDENTIAL_TEMPLATE_API.successResponseMessage,
    type: SchemaDetailsResponseEntity,
  })
  async getCredentialTemplateById(@Query('templateId') templateId: string) {
    return await this.schemaReadService.getCredentialTemplateById(templateId)
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Delete(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: DELETE_CREDENTIAL_TEMPLATE_API.summary,
    description: DELETE_CREDENTIAL_TEMPLATE_API.description,
  })
  @ApiResponse({
    status: DELETE_CREDENTIAL_TEMPLATE_API.successResponseCode,
    description: DELETE_CREDENTIAL_TEMPLATE_API.successResponseMessage,
    type: MessageResponseEntity,
  })
  async deleteCredentialTemplate(@Query('templateId') templateId: string) {
    return await this.schemaDeleteService.deleteCredentialTemplate(templateId)
  }

  /**
   * Issues a new verifiable credential.
   * @param didRequest The request body containing data required to issue the credential.
   * @returns The result of issuing the verifiable credential if successful.
   */
  @Post(ApiRoutes.ISSUE_CREDENTIAL)
  @ApiOperation({
    summary: ISSUE_CREDENTIAL_API.summary,
    description: ISSUE_CREDENTIAL_API.description,
  })
  @ApiBody({ type: IssueCredentialRequestEntityDto })
  @ApiResponse({
    status: ISSUE_CREDENTIAL_API.successResponseCode,
    description: ISSUE_CREDENTIAL_API.successResponseMessage,
  })
  async issueCredential(@Body() issueRequest: IssueCredentialRequestDto) {
    return await this.vcCreateService.issueCredential(issueRequest)
  }

  /**
   * Creates a new verifiable credential.
   * @param didRequest The request body containing data required to issue the credential.
   * @returns The result of issuing the verifiable credential if successful.
   */
  @Post(ApiRoutes.CREDENTIAL)
  @ApiOperation({
    summary: SELF_ISSUE_CREDENTIAL_API.summary,
    description: SELF_ISSUE_CREDENTIAL_API.description,
  })
  @ApiBody({ type: IssueCredentialRequestEntityDto })
  @ApiResponse({
    status: SELF_ISSUE_CREDENTIAL_API.successResponseCode,
    description: SELF_ISSUE_CREDENTIAL_API.successResponseMessage,
  })
  async createSelfIssuedCredential(@Body() issueRequest: CreateCredentialRequestDto) {
    return await this.vcCreateService.createSelfCredential(issueRequest)
  }

  /**
   * Verifies a verifiable credential by its Id/QrCode.
   * @param vcId The ID or QR code of the verifiable credential to verify.
   * @returns The result of verifying the verifiable credential if successful.
   */
  @Get(`${ApiRoutes.CREDENTIAL}/:vcId/verify`)
  @ApiOperation({
    summary: VERIFY_CREDENTIAL_API.summary,
    description: VERIFY_CREDENTIAL_API.description,
  })
  @ApiResponse({
    status: VERIFY_CREDENTIAL_API.successResponseCode,
    description: VERIFY_CREDENTIAL_API.successResponseMessage,
  })
  async verifyCredential(@Param('vcId') vcId: string) {
    return await this.vcCreateService.verifyCredential(vcId)
  }

  /**
   * Retrieves details of a verifiable credential by its ID.
   * @param vcId The ID of the verifiable credential to retrieve details for.
   * @param outputType The desired output type for the response (e.g., application/pdf, text/html).
   * @param templateId The ID of the template to use for generating the response.
   * @param res The response object used to send the response.
   */
  @Get(`${ApiRoutes.CREDENTIAL}/:vcId`)
  @ApiOperation({
    summary: GET_CREDENTIAL_API.summary,
    description: GET_CREDENTIAL_API.description,
  })
  @ApiParam({ name: 'vcId', description: 'Verifiable Credential ID' })
  @ApiResponse({
    status: GET_CREDENTIAL_API.successResponseCode,
    description: GET_CREDENTIAL_API.successResponseMessage,
  })
  async getVcDetailsById(
    @Param('vcId') vcId: string,
    @Headers('accept') outputType: string,
    @Headers('templateId') templateId: string,
    @Res() res,
  ) {
    if (outputType === ApiFileMimetype.PDF || outputType === ApiFileMimetype.HTML) {
      // Returns pdf/html
      await this.vcReadService.getVcVisualDocument(vcId, outputType, templateId, res)
    } else {
      await this.vcReadService.getVcDetailsById(vcId, res)
    }
  }
}
