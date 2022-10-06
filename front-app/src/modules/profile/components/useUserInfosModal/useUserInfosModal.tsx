import { useChangeImgProfileMutation } from "modules/auth/queries/useChangeImgProfile.mutation";
import { useChangePseudoMutation } from "modules/auth/queries/useChangePseudo.mutation";
import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";
import { Button } from "modules/common/components/_ui/Button/Button";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useAppContextState } from "modules/common/context/AppContext";
import { useActivate2Fa } from "modules/profile/mutation/useActivate2Fa.mutation";
import { useGenerate2Fa } from "modules/profile/mutation/useGenerate2Fa.mutation";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { useController, useForm } from "react-hook-form";

interface FormData {
  username: string;
  otp: string;
  file: string;
}

export const useUserInfosModal = () => {
  const { data: user } = useMyProfileQuery();
  const { handleSubmit, formState, register, control, setValue } =
    useForm<FormData>({
      mode: "onTouched",
      defaultValues: {
        username: "",
        otp: "",
        file: "",
      },
    });

  useEffect(() => {
    setValue("username", user?.pseudo);
  }, [user?.pseudo]);

  console.log("$$pseudoooo", user?.pseudo);
  const { errors } = formState;

  const {
    mutate: generateQrCode,
    data: QrCode,
    isLoading: isGeneratingQrCode,
  } = useGenerate2Fa();

  const { mutate: uploadImgProfile, isLoading: isUploadingImg } =
    useChangeImgProfileMutation();

  const { mutateAsync: activate2Fa, isLoading: isActivating2Fa } =
    useActivate2Fa();

  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name: "file",
    control,
  });

  const changeFile = (file?: File) => {
    file && onChange(file);
  };

  const { open: openFileDialogHandler } = useDropzone({
    multiple: false,
    noClick: true,
    // accept: {
    //   "image/png": [".png"],
    //   "image/jpeg": [".jpg", ".jpeg"],
    // },
    onDropAccepted: (file: File[]) => {
      console.log("$$file", file);
      file && uploadImgProfile(file?.[0]);
      // onFileLoaded && onFileLoaded(file?.[0]); put the putation here
    },
    onDropRejected: (fileRejections) => {
      changeFile(fileRejections?.[0]?.file);
    },
  });

  const { mutate: changePseudo, isLoading: isChangingPseudo } =
    useChangePseudoMutation();

  const { doubleFaEnabled } = useAppContextState();

  const urlImage =
    user?.profileImage &&
    `http://localhost:3000/users/me/pp/${user?.profileImage}`;

  const UserInfos = () => (
    <div className="flex items-center flex-col space-y-8">
      <div>
        <div className="flex relative rounded-full border border-gray-100 w-24 h-24 shadow-sm mb-3">
          <Image
            layout="fill"
            unoptimized={true}
            loader={() => urlImage || "/assets/img/42.png"}
            src={urlImage || "/assets/img/42.png"}
            priority={true}
            className="rounded-full border border-gray-100 shadow-sm"
          />
        </div>
        <Button
          variant="link"
          onClick={openFileDialogHandler}
          isLoading={isUploadingImg}
        >
          Modifier
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(({ username }) => {
          changePseudo(username);
        })}
        className="flex flex-row gap-3"
      >
        <TextField
          id="username"
          {...register("username")}
          error={errors.username}
          control={control}
        />
        <Button variant="contained" color="active" isLoading={isChangingPseudo}>
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
            <Button
              variant="contained"
              color="active"
              isLoading={isActivating2Fa}
            >
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
              isLoading={isGeneratingQrCode}
            >
              Activer
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return useContentModal({
    content: <UserInfos />,
    headerTitle: "Modifier mon profil",
  });
};
