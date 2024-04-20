import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { VcCategory, VcType } from 'src/common/constants/enums'

export class PushVCRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  did: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  walletId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: VcType

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: VcCategory | string

  @IsString()
  @ApiProperty()
  templateId?: string

  @IsNotEmpty()
  @ApiProperty()
  tags: string[]

  @ApiProperty()
  @IsString()
  vcIconUrl?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string

  constructor(
    did: string,
    walletId: string,
    type: VcType,
    category: string,
    vcIconUrl: string,
    templateId: string,
    tags: string[],
    name: string,
  ) {
    this.did = did
    this.walletId = walletId
    this.type = type
    this.category = category
    this.vcIconUrl = vcIconUrl
    this.templateId = templateId
    this.tags = tags
    this.name = name
  }
}
