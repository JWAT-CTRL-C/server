import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsString()
  @IsNotEmpty()
  noti_tle: string;

  @IsString()
  @IsNotEmpty()
  noti_cont: string;

  // user
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  // Workspace
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  wksp_id: string;
}
