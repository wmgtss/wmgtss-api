import { ApiProperty } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class SignupResponseDto extends SignupDto {
  @ApiProperty()
  pwned?: number;
}
