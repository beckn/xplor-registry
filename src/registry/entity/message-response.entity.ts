import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class MessageResponseEntity {
  @IsString()
  @ApiProperty({ example: 'resource deleted successfully' })
  message: string
}
