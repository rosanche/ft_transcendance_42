import { Icon42Logo } from "modules/common/components/_icons/icons";
import { Button } from "modules/common/components/_ui/Button/Button";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface FormData {
  otp: string;
}

export const OtpAuthentification = () => {
  const router = useRouter();

  const { control, handleSubmit, formState, register } = useForm<FormData>({
    defaultValues: {
      otp: "",
    },
  });
  const { errors } = formState;

  return (
    <>
      <span className="text-white text-3xl font-default font-bold mb-16">
        Renseignez votre code de vérification de google authenticator
      </span>
      <form onSubmit={handleSubmit(() => {})} className="flex flex-row gap-3">
        <TextField id="email" {...register("otp")} error={errors.otp} />
        <Button variant="contained" color="active">
          Valider
        </Button>
      </form>
    </>
  );
};
