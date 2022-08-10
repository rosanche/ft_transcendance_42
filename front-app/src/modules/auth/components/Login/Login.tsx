import { Icon42Logo } from "modules/common/components/_icons/icons";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useRouter } from "next/router";

interface Props {
  url: string;
  className: string;
}

export const Login = () => {
  const router = useRouter();

  return (
    <>
      <span className="text-white text-4xl font-default font-bold italic mb-16">
        Il est temps de gagner des points !
      </span>
      <Button
        variant="contained"
        color="active"
        icon={<Icon42Logo />}
        onClick={() => router.replace("http://localhost:3000/auth/42api")}
      >
        Se connecter
      </Button>
    </>
  );
};
