import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class CredentialReceiverDto {
  @IsString({ message: 'Wallet ID must be a string' })
  @ApiProperty({ description: 'ID of the wallet receiving the credential' })
  walletId: string

  @IsString({ message: 'VC name must be a string' })
  @ApiProperty({ description: 'Name of the verifiable credential' })
  vcName: string

  @IsString({ message: 'Category must be a string' })
  @ApiProperty({ description: 'Category of the verifiable credential' })
  category: string

  @IsArray({ message: 'Tags must be an array' })
  @ApiProperty({ description: 'Tags associated with the verifiable credential' })
  tags: string[]
}

class CredentialDto {
  @IsNotEmpty({ message: 'context is required' })
  @IsArray({ message: 'Context must be an array' })
  @ApiProperty({ description: 'Context of the verifiable credential' })
  context: any[]

  @IsString({ message: 'Template ID must be a string' })
  @ApiProperty({ description: 'ID of the credential template' })
  templateId: string

  @IsNotEmpty({ message: 'schemaId is required' })
  @IsString({ message: 'Schema ID must be a string' })
  @ApiProperty({ description: 'ID of the credential schema' })
  schemaId: string

  @IsNotEmpty({ message: 'schemaVersion is required' })
  @IsString({ message: 'Schema version must be a string' })
  @ApiProperty({ description: 'Version of the credential schema' })
  schemaVersion: string

  @IsNotEmpty({ message: 'credentialIconUrl is required' })
  @IsString({ message: 'Credential icon URL must be a string' })
  @ApiProperty({ description: 'URL of the credential icon' })
  credentialIconUrl: string

  @IsNotEmpty({ message: 'expirationDate is required' })
  @ApiProperty({ description: 'Expiration date of the verifiable credential' })
  expirationDate: string

  @IsNotEmpty({ message: 'organization is required' })
  @IsString({ message: 'Organization must be a string' })
  @ApiProperty({ description: 'Issuing organization of the verifiable credential' })
  organization: string

  @IsNotEmpty({ message: 'Credential subject is required' })
  @ValidateNested()
  @ApiProperty({ description: 'Subject of the verifiable credential' })
  credentialSubject: Record<string, any>

  @IsNotEmpty({ message: 'type is required' })
  @IsArray({ message: 'Type must be an array' })
  @ApiProperty({ description: 'Type of the verifiable credential' })
  type: string[]

  @IsNotEmpty({ message: 'tags are required' })
  @IsArray({ message: 'Tags must be an array' })
  @ApiProperty({ description: 'Tags associated with the verifiable credential' })
  tags: string[]

  constructor(
    context: string[],
    templateId: string,
    schemaId: string,
    schemaVersion: string,
    credentialIconUrl: string,
    expirationDate: string,
    organization: string,
    credentialSubject: Record<string, any>,
    type: string[],
    tags: string[],
  ) {
    this.context = context
    this.templateId = templateId
    this.schemaId = schemaId
    this.schemaVersion = schemaVersion
    this.credentialIconUrl = credentialIconUrl
    this.expirationDate = expirationDate
    this.organization = organization
    this.credentialSubject = credentialSubject
    this.type = type
    this.tags = tags
  }
}

export class IssueCredentialRequestDto {
  @IsString({ message: 'Issuer ID must be a string' })
  @IsNotEmpty({ message: 'Issuer ID is required' })
  @ApiProperty({ description: 'ID of the issuer' })
  issuerId: string

  @ValidateNested()
  @ApiProperty({ description: 'Details of the credential receiver' })
  credentialReceiver: CredentialReceiverDto

  @ValidateNested()
  @ApiProperty({ description: 'Details of the verifiable credential' })
  credential: CredentialDto
}
