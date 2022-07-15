import { IsEmail, IsNotEmpty, IsString, IsInt,IsNumberString} from "class-validator";

export class gameDto {
    @IsNumberString()
    id_1: String;
    @IsNumberString()
    id_2: String;
}