import { IsEmail, IsNotEmpty, IsString, IsEmpty, IsInt,IsNumberString, IsNumber} from "class-validator";

export class AuthUpDto {
    @IsEmail()
    @IsNotEmpty()
    email?:  string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsString()
    @IsNotEmpty()
    pseudo: string;
}

export class AuthInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserUpdateDto {
    @IsString()
    pseudo: string;
}

export class FriendDto {
    @IsNumberString()
    //@IsInt()
    id: Number
}

export class CodeAuthDto {
    @IsString()
    @IsNumberString()
    @IsNotEmpty()
    twoFactorAuthenticationCode: string;
}