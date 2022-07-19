import { IsEmail, IsNotEmpty, IsString, IsEmpty} from "class-validator";

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
    password: string;
    @IsString()
    pseudo: string;
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsString()
    legend: string;
}
