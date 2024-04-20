import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'

class SubSchemaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Proof-of-Skill-Credential-1.0' })
  $id: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://json-schema.org/draft/2019-09/schema' })
  $schema: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'The holder is holding the certificate of Skill' })
  description: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'object' })
  type: string

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      studentName: {
        type: 'string',
      },
    },
  })
  properties: Record<string, any>

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  additionalProperties: boolean
}

class SchemaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://w3c-ccg.github.io/vc-json-schemas/' })
  type: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1.0.0' })
  version: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Proof of Academic Evaluation Credential' })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'did:rcw:6b9d7b31-bc7f-454a-be30-b6c7447b1cff' })
  author: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-12-19T09:22:23.064Z' })
  authored: string

  @ApiProperty({ example: SubSchemaDto })
  @IsObject()
  @IsNotEmpty()
  schema: SubSchemaDto
}

export class CreateSchemaRequestDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({ example: SchemaDto })
  schema: SchemaDto

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['certificate', 'skill', 'doctor'] })
  tags: string[]

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'DRAFT' })
  status: string
}
