import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSystemNotificationDTO {
  @IsString()
  @IsNotEmpty()
  noti_tle: string;

  @IsString()
  @IsNotEmpty()
  noti_cont: string;

  // Workspace
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  wksp_id: string;
}
