import { ApiProperty } from '@nestjs/swagger'

export class TemplateDetailsResponseEntity {
  @ApiProperty({ example: 'clui8j9tc0004mh3laucjio8b' })
  templateId: string

  @ApiProperty({ example: 'did:schema:90d2ad63-1f37-40a2-a0c9-ad5d41027234' })
  schemaId: string

  @ApiProperty({ example: '<html><h1>{{certificateLink}}</h1></html>' })
  template: string

  @ApiProperty({ example: 'certificate' })
  type: string

  @ApiProperty({ example: '2024-04-02T10:27:23.377Z' })
  createdAt: Date

  @ApiProperty({ example: '2024-04-02T10:27:23.377Z' })
  updatedAt: Date

  @ApiProperty({ example: null })
  createdBy: any

  @ApiProperty({ example: null })
  updatedBy: any
}
