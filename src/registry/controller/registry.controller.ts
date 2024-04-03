import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiRoutes } from 'src/common/constants/api-routes'
import { CreateSchemaRequestDto } from '../dto/create-schema-request-body.dto'
import { CreateTemplateRequestBodyDto } from '../dto/create-template-request-body.dto'
import { CreateUserDIDRequestDto } from '../dto/create-user-did-request.dto'
import { GetSchemaDetailsRequestDto } from '../dto/get-schema-details-request.dto'
import { IssueCredentialRequestDto } from '../dto/issue-credential-status-request.dto'
import { UpdateCredentialStatusRequestDto } from '../dto/update-credential-request.dto'
import { UpdateSchemaRequestDto } from '../dto/update-schema-request-body.dto'
import { IssueCredentialRequestEntityDto } from '../entity/issue-credential-request.entity'
import { MessageResponseEntity } from '../entity/message-response.entity'
import { SchemaDetailsResponseEntity } from '../entity/schema-details-response.entity'
import { TemplateDetailsResponseEntity } from '../entity/template-details-response.entity'
import { CredentialSchemaCreateService } from '../service/credential-schema-create.service'
import { CredentialSchemaDeleteService } from '../service/credential-schema-delete.service'
import { CredentialSchemaReadService } from '../service/credential-schema-read.service'
import { CredentialSchemaUpdateService } from '../service/credential-schema-update.service'
import { UserDidService } from '../service/user-did.service'
import { VerifiableCredentialCreateService } from '../service/verifiable-credential-create.service'
import { VerifiableCredentialReadService } from '../service/verifiable-credential-read.service'

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
    summary: 'Generate User DID',
    description:
      'Generates a new user DID using Sunbird RC. This did acts as a issuer/administrator for all the actions like issuing VC, creating certificate Schema in Sunbird RC.',
  })
  @ApiBody({ type: CreateUserDIDRequestDto })
  @ApiResponse({ status: 201, description: 'User DID generated successfully.' })
  async generateUserDid(@Body() didRequest: CreateUserDIDRequestDto) {
    const generateDid = await this.userDidService.generateUserDid(didRequest)
    return generateDid
  }

  /**
   * Create a Schema for the credential for your VCs. This schema contains the subject details of the VC like FullName, CourseName etc.
   * @body body The request body containing data required to create the credential Schema.
   * @returns The result of the api would be the details of the created Schema.
   */
  @Post(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: 'Create Credential Schema',
    description:
      'Create a Schema for the credential for your VCs. This schema contains the subject details of the VC like FullName, CourseName etc.',
  })
  @ApiResponse({
    status: 201,
    description: 'Credential Schema created successfully.',
    type: SchemaDetailsResponseEntity,
  })
  async createCredentialSchema(@Body() body: CreateSchemaRequestDto) {
    const schemaResult = await this.schemaCreateService.createSchema(body)
    return schemaResult
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Get(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: 'Get Credential Schema by schema id and version',
    description: 'Returns the Schema details with the entered schema id and the version.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credential Schema details fetched successfully.',
    type: SchemaDetailsResponseEntity,
  })
  async getCredentialSchemaByIdAndVersion(@Query() queryParams: GetSchemaDetailsRequestDto) {
    const schemaResult = await this.schemaReadService.getCredentialSchemaByIdAndVersion(queryParams)
    return schemaResult
  }

  /**
   * Updates the status of the schema to Deprecate, Publish, Revoke.
   * @body didRequest The request params containing schemaId and schemaVersion, stauts to update Schema
   * @returns The result of the api would be the details of the updated Schema.
   */
  @Patch(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: 'Update Credential Schema status',
    description: 'Returns the Updated Schema details with the updated status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credential Schema status updated successfully.',
    type: SchemaDetailsResponseEntity,
  })
  async updateSchemaStatus(@Body() body: UpdateCredentialStatusRequestDto) {
    const schemaResult = await this.schemaUpdateService.updateSchemaStatus(body)
    return schemaResult
  }

  /**
   * Updates the Schema properties and context
   * @body didRequest The request params containing payload to update Schema same as the create Schema.
   * @returns The result of the api would be the details of the updated Schema.
   */
  @Put(ApiRoutes.CREDENTIAL_SCHEMA)
  @ApiOperation({
    summary: 'Update Credential Schema',
    description: 'Returns the Updated Schema details with the updated fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credential Schema updated successfully.',
    type: SchemaDetailsResponseEntity,
  })
  async updateSchemaProperties(@Body() body: UpdateSchemaRequestDto) {
    const schemaResult = await this.schemaUpdateService.updateSchemaProperties(body)
    return schemaResult
  }

  /**
   * Create Schema Template to render the document of the VC in pdf, html format.
   * @body The body takes html template of the Credential Schema.
   * @returns The result of the api would be the details of the created Template
   */
  @Post(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: 'Create Credential Schema Template',
    description: 'Create Schema Template to render the document of the VC in pdf, html format.',
  })
  @ApiResponse({
    status: 201,
    description: 'Credential Template created successfully.',
    type: TemplateDetailsResponseEntity,
  })
  async createCredentialSchemaTemplate(@Body() templateBody: CreateTemplateRequestBodyDto) {
    const templateResult = await this.schemaCreateService.createCredentialSchemaTemplate(templateBody)
    return templateResult
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Get(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: 'Get Credential template by template id',
    description: 'Returns the template details with the entered template id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credential Schema Template details fetched successfully.',
    type: SchemaDetailsResponseEntity,
  })
  async getCredentialTemplateById(@Query('templateId') templateId: string) {
    const schemaResult = await this.schemaReadService.getCredentialTemplateById(templateId)
    return schemaResult
  }

  /**
   * Returns the Schema details with the entered schema id and the version.
   * @param didRequest The request params containing schemaId and schemaVersion to fetch Schema details
   * @returns The result of the api would be the details of the fetched Schema.
   */
  @Delete(ApiRoutes.CREDENTIAL_TEMPLATE)
  @ApiOperation({
    summary: 'Delete Credential template',
    description: 'Delete the template using the templateId',
  })
  @ApiResponse({
    status: 200,
    description: 'Credential Template deleted successfully.',
    type: MessageResponseEntity,
  })
  async deleteCredentialTemplate(@Query('templateId') templateId: string) {
    const schemaResult = await this.schemaDeleteService.deleteCredentialTemplate(templateId)
    return schemaResult
  }

  /**
   * Issues a new verifiable credential.
   * @param didRequest The request body containing data required to issue the credential.
   * @returns The result of issuing the verifiable credential if successful.
   */
  @Post(ApiRoutes.CREDENTIAL)
  @ApiOperation({
    summary: 'Issue Credential',
    description:
      'Issues a new verifiable credential via Sunbird RC. Takes the Issuer details, credential certificate receiver details, subject details of the Sunbird Credential and generates a new VC and pushes it to the receiver user wallet.',
  })
  @ApiBody({ type: IssueCredentialRequestEntityDto })
  @ApiResponse({ status: 201, description: 'Verifiable credential issued successfully.' })
  async issueCredential(@Body() didRequest: IssueCredentialRequestDto) {
    const vcResult = await this.vcCreateService.issueCredential(didRequest)
    return vcResult
  }

  /**
   * Verifies a verifiable credential by its Id/QrCode.
   * @param vcId The ID or QR code of the verifiable credential to verify.
   * @returns The result of verifying the verifiable credential if successful.
   */
  @Get(`${ApiRoutes.CREDENTIAL}/:vcId/verify`)
  @ApiOperation({
    summary: 'Verify Credential',
    description:
      'Verifies a verifiable credential by its Id/QrCode by communicating with Sunbird RC Layer. The request contains a path for VC Id by which the VC is verified.',
  })
  @ApiResponse({ status: 200, description: 'Verifiable credential verified successfully.' })
  async verifyCredential(@Param('vcId') vcId: string) {
    const vcResult = await this.vcCreateService.verifyCredential(vcId)
    return vcResult
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
    summary: 'Get Verifiable Credential Details by VcId',
    description:
      'Retrieves details of a verifiable credential by its ID. Returns all the details of the credential in W3C Format(Json Ld) that is generated via Sunbird RC',
  })
  @ApiParam({ name: 'vcId', description: 'Verifiable Credential ID' })
  @ApiResponse({ status: 200, description: 'Verifiable credential details retrieved successfully.' })
  async getVcDetailsById(
    @Param('vcId') vcId: string,
    @Headers('accept') outputType: string,
    @Headers('templateId') templateId: string,
    @Res() res,
  ) {
    let vcResult = {}
    if (outputType == 'application/pdf' || outputType == 'text/html') {
      // Returns pdf/html
      await this.vcReadService.getVcVisualDocument(vcId, outputType, templateId, res)
    } else {
      vcResult = await this.vcReadService.getVcDetailsById(vcId)
      res.send(vcResult)
    }
  }
}
