import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTemplateRequestBodyDto {
  @IsString()
  @ApiProperty({ example: 'did:schema:90d2ad63-1f37-40a2-a0c9-ad5d41027234' })
  @IsNotEmpty()
  schemaId: string

  @IsString()
  @ApiProperty({ example: '1.0.0' })
  @IsNotEmpty()
  schemaVersion: string

  @IsString()
  @ApiProperty({ example: '<html><h1>{{certificateLink}}</h1></html>' })
  @IsNotEmpty()
  templateHtml: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'certificate' })
  type: string
}
