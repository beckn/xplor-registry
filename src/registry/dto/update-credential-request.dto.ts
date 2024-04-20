import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { SchemaStatusEnum } from 'src/common/constants/enums'

export class UpdateCredentialStatusRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'did:rcw:6b9d7b31-bc7f-454a-be30-b6c7447b1cff' })
  schemaId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1.0.0' })
  schemaVersion: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: SchemaStatusEnum.PUBLISH })
  status: string
}
