import { IsEmail, IsNotEmpty, IsString, IsInt,IsNumberString, IsBoolean} from "class-validator";

export class ChannelDto {
    @IsBoolean()
    @IsNotEmpty()
    private: boolean;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    password?: string;
}

export class InviteDto {

    @IsString()
    @IsNotEmpty()
    pseudo: string;
    @IsString()
    @IsNotEmpty()
    name: string;
}