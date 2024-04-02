import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class CredentialReceiverDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  documentType: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  documentName: string
}

class CredentialDto {
  @IsArray()
  @ApiProperty()
  context: any[]

  @IsString()
  @ApiProperty()
  templateId: string

  @IsString()
  @ApiProperty()
  schemaId: string

  @IsString()
  @ApiProperty()
  schemaVersion: string

  @IsDateString()
  @ApiProperty()
  expirationDate: string

  @IsString()
  @ApiProperty()
  organization: string

  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  credentialSubject: Record<string, any>

  @IsArray()
  @ApiProperty()
  type: string[]

  @IsArray()
  @ApiProperty()
  tags: string[]

  constructor(
    context: string[],
    templateId: string,
    schemaId: string,
    schemaVersion: string,
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
    this.expirationDate = expirationDate
    this.organization = organization
    this.credentialSubject = credentialSubject
    this.type = type
    this.tags = tags
  }
}

export class IssueCredentialRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  issuerId: string

  @ValidateNested()
  @ApiProperty()
  credentialReceiver: CredentialReceiverDto

  @ValidateNested()
  @ApiProperty()
  credential: CredentialDto
}
