import { ApiProperty } from '@nestjs/swagger'

export class SchemaDetailsResponseEntity {
  @ApiProperty({ example: 'https://w3c-ccg.github.io/vc-json-schemas/', description: 'Type of schema' })
  type: string

  @ApiProperty({ example: 'did:schema:36104c99-a207-4ecd-b015-b9aa44f11b2d', description: 'ID of the schema' })
  id: string

  @ApiProperty({ example: '1.0.0', description: 'Version of the schema' })
  version: string

  @ApiProperty({ example: 'User issued certificate', description: 'Name of the schema' })
  name: string

  @ApiProperty({ example: 'did:uhuiio:da85b501-7b74-489c-9ce3-0feec59340c9', description: 'Author of the schema' })
  author: string

  @ApiProperty({ example: '2024-02-27T09:22:23.064Z', description: 'Date and time the schema was authored' })
  authored: string

  @ApiProperty({
    example: {
      $id: 'Proof-of-Skill-Credential-1.0',
      $schema: 'https://json-schema.org/draft/2019-09/schema',
      description: 'This certificate is a user issued certificate that the user uploaded by itself.',
      type: 'object',
      properties: { certificateLink: { type: 'string' } },
      required: ['certificateLink'],
      additionalProperties: true,
    },
    description: 'Schema details',
  })
  schema: {
    $id: string
    $schema: string
    description: string
    type: string
    properties: { certificateLink: { type: string } }
    required: string[]
    additionalProperties: boolean
  }

  @ApiProperty({
    example: ['userIssuedCertificate', 'user-issued-certificate'],
    description: 'Tags associated with the schema',
  })
  tags: string[]

  @ApiProperty({ example: 'DRAFT', description: 'Status of the schema' })
  status: string

  @ApiProperty({ example: '2024-04-02T07:01:05.455Z', description: 'Date and time the schema was created' })
  createdAt: string

  @ApiProperty({ example: '2024-04-02T07:01:05.455Z', description: 'Date and time the schema was last updated' })
  updatedAt: string

  @ApiProperty({ example: null, description: 'Date and time the schema was deleted, if applicable' })
  deletedAt: string | null

  @ApiProperty({ example: null, description: 'User who created the schema' })
  createdBy: string | null

  @ApiProperty({ example: null, description: 'User who last updated the schema' })
  updatedBy: string | null
}
