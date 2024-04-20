import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class CredentialDto {
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  certificateLink: string

  @IsArray()
  @ApiProperty()
  tags: string[]

  constructor(certificateLink: string, tags: string[]) {
    this.certificateLink = certificateLink
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