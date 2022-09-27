import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Login } from "modules/auth/components/Login/Login";
import { Page } from "modules/common/components/_ui/Page/Page";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useForm } from "react-hook-form";
import { useGenerate2Fa } from "modules/profile/mutation/useGenerate2Fa.mutation";
import { QrCode } from "modules/auth/components/QrCode";
import { useActivate2Fa } from "modules/profile/mutation/useActivate2Fa.mutation";
import { Spinner } from "modules/common/components/_ui/Spinner/Spinner";
import { FriendsContainer } from "modules/profile/components/FriendsContainer/FriendsList";

interface FormData {
  username: string;
}

const Profil = () => {
  const router = useRouter();
  const { data: user, isLoading } = useMyProfileQuery();
  const { mutateAsync, data: QrCod, status: sta } = useGenerate2Fa();
  const { mutateAsync: activate2Fa, data: fa, status: fas } = useActivate2Fa();

  // console.log("$$date", user, status);
  // console.log("$$Datas", QrCod, sta);
  console.log("$$activation", fa, fas);
  const { control, handleSubmit, formState, register } = useForm<FormData>({
    defaultValues: {
      username: "",
    },
  });
  const { errors } = formState;

  useEffect(() => {
    mutateAsync();
  }, []);

  const Content = () => (
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
      <div className="flex flex-1 flex-col">
        <span className="text-pink text-2xl font-default font-medium italic">
          Double authentification désactivé
        </span>
        <Button variant="contained" color="active">
          Activer
        </Button>
        {/* {QrCod && <QrCode url={QrCod} /> } */}
      </div>
    </div>
  );

  const { showModal } = useContentModal({
    content: <Content />,
    headerTitle: "Modifier mon profil",
  });

  return (
    <Page title="Profil">
      {!isLoading ? (
        <>
          <div className="flex flex-col items-center  mb-16 space-y-4">
            <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
              <Image
                layout="fill"
                src="/assets/img/ping-pong.png"
                className="rounded-full border border-gray-100 shadow-sm"
              />
            </div>
            <span className="text-white text-2xl font-default font-bold italic">
              A toi de jouer {user?.pseudo} !
            </span>
            <span className="text-pink text-2xl font-default font-medium italic">
              Double authentification désactivé
            </span>
            <Button variant="link" onClick={showModal}>
              Modifier
            </Button>
          </div>
          <FriendsContainer friends={user?.myfriends} />
        </>
      ) : (
        <Spinner />
      )}
    </Page>
  );
};

export default Profil;
