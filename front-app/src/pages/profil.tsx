import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Page } from "modules/common/components/_ui/Page/Page";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { FriendsContainer } from "modules/profile/components/FriendsContainer/FriendsContainer";
import { useAppContextState } from "modules/common/context/AppContext";
import { useUserInfosModal } from "modules/profile/components/useUserInfosModal/useUserInfosModal";
import { NotificationsContainer } from "modules/profile/components/NotificationsContainer/NotificationsContainer";
import { useSocketContext } from "modules/common/context/SocketContext";

const Profil = () => {
  const router = useRouter();
  const { data: user, isLoading } = useMyProfileQuery();
  const { doubleFaEnabled } = useAppContextState();
  const socket = useSocketContext();

  console.log("$$date", user);

  const { showModal } = useUserInfosModal();

  return (
    <Page title="Profil" isLoading={isLoading}>
      <div className="grid grid-flow-col space-x-3">
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
            Double authentification {doubleFaEnabled ? "activé" : "désactivé"}
          </span>
          <Button variant="link" onClick={showModal}>
            Modifier
          </Button>
        </div>
        <FriendsContainer friends={user?.myfriends} />
        <NotificationsContainer friends={user?.friendReqReceive} />
      </div>
    </Page>
  );
};

export default Profil;
