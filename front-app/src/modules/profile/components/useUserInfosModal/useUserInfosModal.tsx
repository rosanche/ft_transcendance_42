import { useChangeImgProfileMutation } from "modules/auth/queries/useChangeImgProfile.mutation";
import { useChangePseudoMutation } from "modules/auth/queries/useChangePseudo.mutation";
import { useNewUserQuery } from "modules/auth/queries/useNewUserQuery";
import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";
import { Button } from "modules/common/components/_ui/Button/Button";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useActivate2Fa } from "modules/profile/mutation/useActivate2Fa.mutation";
import { useGenerate2Fa } from "modules/profile/mutation/useGenerate2Fa.mutation";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import React, { createRef, useCallback } from "react";
import Image from "next/image";
import Dropzone, { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { useController, useForm } from "react-hook-form";
import { useDesactivate2Fa } from "modules/profile/mutation/useDesactivate2Fa.mutation";

interface FormData {
  username: string;
  otp: string;
  file: string;
}

export const useUserInfosModal = () => {
  const { data: user } = useMyProfileQuery();
  const { data: newUser } = useNewUserQuery();
  const router = useRouter();
  const { handleSubmit, formState, register, control, setValue } =
    useForm<FormData>({
      mode: "onTouched",
      defaultValues: {
        username: "",
        otp: "",
        file: "",
      },
    });

  const dropzoneRef = createRef();
  const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const onDropAccepted = useCallback((file: File[]) => {
    file && uploadImgProfile(file?.[0]);
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    changeFile(fileRejections?.[0]?.file);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {}, []);

  // Disable click and keydown behavior on the <Dropzone>

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

  const { mutateAsync: desactivate2Fa, isLoading: isDesactivating2Fa } =
    useDesactivate2Fa();

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

  // const { open } = useDropzone({
  //   multiple: false,
  //   noClick: true,
  //   noKeyboard: true,
  //   onDropAccepted,
  //   onDropRejected,
  // });

  const { mutate: changePseudo, isLoading: isChangingPseudo } =
    useChangePseudoMutation();

  const urlImage =
    user?.profileImage &&
    `http://localhost:3000/users/me/pp/${user?.profileImage}`;

  const UserInfos = () => (
    <div className="flex items-center flex-col space-y-8">
      <div>
        <div className="flex relative rounded-full border border-gray-100 w-24 h-24 shadow-sm mb-3">
          <Image
            layout="fixed"
            width={96}
            height={96}
            loading="eager"
            loader={() => urlImage || "/assets/img/42.png"}
            src={urlImage || "/assets/img/42.png"}
            priority={true}
            className="rounded-full border border-gray-100 shadow-sm"
          />
        </div>
      </div>
      <Dropzone
        ref={dropzoneRef}
        noClick={true}
        noKeyboard={true}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        multiple={false}
      >
        {({ getRootProps, getInputProps, open, acceptedFiles }) => {
          return (
            <div className="container">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <Button
                  variant="link"
                  onClick={open}
                  isLoading={isUploadingImg}
                >
                  Modifier
                </Button>
              </div>
            </div>
          );
        }}
      </Dropzone>
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
            router.reload();
          })}
        >
          <div className="flex flex-1  space-y-4 flex-col items-center">
            <span className="text-base text-pink font-bold mb-4">
              Scannez ce QR code avec Google Authenticator
            </span>
            <Image
              width={120}
              height={120}
              src={QrCode}
              className="rounded-3x"
              priority
            />
            <div className="space-y-4">
              <TextField
                id="otp"
                {...register("otp")}
                error={errors.username}
              />
              <Button
                variant="contained"
                color="active"
                isLoading={isActivating2Fa}
              >
                Activer
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-1 space-y-4 flex-col">
          <span className="text-pink text-2xl font-default font-medium italic">
            Double authentification{" "}
            {newUser?.is2faEnabled ? "activé" : "désactivé"}
          </span>
          {newUser?.is2faEnabled ? (
            <Button
              variant="contained"
              color="active"
              onClick={() => {
                desactivate2Fa();
                router.reload();
              }}
              isLoading={isDesactivating2Fa}
            >
              Désactiver
            </Button>
          ) : (
            <Button
              variant="contained"
              color="active"
              onClick={() => {
                generateQrCode();
              }}
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
