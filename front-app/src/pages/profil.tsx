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
import { useSideBarContext } from "modules/common/context/SidebarContext";
import { GameHistoryContainer } from "modules/profile/components/GameHistoryContainer/GameHistoryContainer";
import { useGameHistoryQuery } from "modules/profile/queries/useGameHistoryQuery";

const Profil = () => {
  const { data: user, isLoading: isProfilLoading } = useMyProfileQuery();
  const { doubleFaEnabled } = useAppContextState();
  console.log("$$date", user);

  const { showModal } = useUserInfosModal();

  console.log(
    "$$friends, blocked",
    user?.myfriends,
    user?.myblocked,
    user?.myfriends?.map((friend) => ({
      ...friend,
      status:
        user?.myblocked?.filter((user) => user.id === friend.id)[0] &&
        "blocked",
    })),
    user?.myblocked?.filter((user) => user.id === 2)
  );

  const friends = user?.myfriends?.map((friend) => ({
    ...friend,
    isBlocked: !!user?.myblocked?.filter((user) => user.id === friend.id)[0],
  }));

  return (
    <Page title="Profil" isLoading={isProfilLoading}>
      <div className="grid grid-flow-col max-h-1/3 space-x-3">
        <div className="flex flex-col items-center  mb-16 space-y-4">
          <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
            <Image
              layout="fill"
              src={
                (user?.profileImage &&
                  `http://localhost:3000/${user?.profileImage}`) ||
                "/assets/img/42.png"
              }
              priority={true}
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
        <FriendsContainer friends={friends} withAddFriendButton />
        <NotificationsContainer friends={user?.friendReqReceive} />
        <GameHistoryContainer id={user?.id} />
      </div>
    </Page>
  );
};

export default Profil;
