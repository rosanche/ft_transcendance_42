import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";
import { Button } from "modules/common/components/_ui/Button/Button";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useAppContextState } from "modules/common/context/AppContext";
import { useActivate2Fa } from "modules/profile/mutation/useActivate2Fa.mutation";
import { useGenerate2Fa } from "modules/profile/mutation/useGenerate2Fa.mutation";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  username: string;
  otp: string;
}

export const useUserInfosModal = () => {
  const { handleSubmit, formState, register } = useForm<FormData>({
    defaultValues: {
      username: "",
      otp: "",
    },
  });
  const { errors } = formState;

  const {
    mutate: generateQrCode,
    data: QrCode,
    status: sta,
    isLoading: isGenerateQrCodeLoading,
  } = useGenerate2Fa();
  const { mutateAsync: activate2Fa, data: fa, status: fas } = useActivate2Fa();

  console.log("$$2fa", fa, fas);

  // console.log("$$qrCode", sta);

  const { doubleFaEnabled } = useAppContextState();

  console.log("$$doubleFaEnabled", doubleFaEnabled);
  // useEffect(() => {
  //   mutateAsync();
  // }, []);

  const UserInfos = () => (
    <div className="flex items-center flex-col space-y-8">
      <div>
        <div className="flex relative rounded-full border border-gray-100 w-24 h-24 shadow-sm mb-3">
          <Image
            layout="fill"
            src="/assets/img/ping-pong.png"
            className="rounded-full border border-gray-100 shadow-sm"
          />
        </div>
        <Button variant="link">Modifier</Button>
      </div>
      <form
        onSubmit={handleSubmit(({ username }) => {
          activate2Fa(username);
        })}
        className="flex flex-row gap-3"
      >
        <TextField
          id="email"
          {...register("username")}
          error={errors.username}
        />
        <Button variant="contained" color="active">
          Valider
        </Button>
      </form>
      {QrCode ? (
        <form
          onSubmit={handleSubmit(({ otp }) => {
            activate2Fa(otp);
          })}
          className="flex  space-y-4"
        >
          <span>Scannez ce QR code avec Google Authenticator</span>
          <Image width={120} height={120} src={QrCode} className="rounded-3x" />
          <div>
            <TextField id="otp" {...register("otp")} error={errors.username} />
            <Button variant="contained" color="active">
              Activer
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-1 flex-col">
          <span className="text-pink text-2xl font-default font-medium italic">
            Double authentification {doubleFaEnabled ? "activé" : "désactivé"}
          </span>
          {!doubleFaEnabled && (
            <Button
              variant="contained"
              color="active"
              onClick={() => generateQrCode()}
              isLoading={isGenerateQrCodeLoading}
            >
              Activer
            </Button>
          )}
          {/* {QrCod && <QrCode url={QrCod} /> } */}
        </div>
      )}
    </div>
  );

  return useContentModal({
    content: <UserInfos />,
    headerTitle: "Modifier mon profil",
  });
};
