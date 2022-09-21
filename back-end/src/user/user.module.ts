import { Module, forwardRef} from "@nestjs/common"
import { GameModule } from "../game/game.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports:[forwardRef(() => GameModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
  })
  export class UserModule {}
