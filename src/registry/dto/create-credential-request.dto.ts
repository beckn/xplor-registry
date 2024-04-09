import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class CredentialReceiverDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  walletId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vcName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: string

  @IsNotEmpty()
  @ApiProperty()
  tags: string[]
}

class CredentialDto {
  @IsArray()
  @ApiProperty()
  context: any[]

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
    schemaId: string,
    schemaVersion: string,
    expirationDate: string,
    organization: string,
    credentialSubject: Record<string, any>,
    type: string[],
    tags: string[],
  ) {
    this.context = context
    this.schemaId = schemaId
    this.schemaVersion = schemaVersion
    this.expirationDate = expirationDate
    this.organization = organization
    this.credentialSubject = credentialSubject
    this.type = type
    this.tags = tags
  }
}

export class CreateCredentialRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  issuerId: string

  @ValidateNested()
  @ApiProperty()
  credential: CredentialDto
}
