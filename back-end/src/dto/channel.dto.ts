import { IsEmail, IsNotEmpty, IsString, IsInt,IsNumberString, IsBoolean} from "class-validator";

export class ChannelDto {
    @IsNumberString()
    private: Number;
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