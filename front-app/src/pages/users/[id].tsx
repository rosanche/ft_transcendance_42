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
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";

const Profil = () => {
  const router = useRouter();
  const { data: users, isLoading: isUsersLoading } = useUsersQuery();

  const userId = parseInt(router.query?.id as string);
  const user = users?.filter((user) => user.id === userId)[0];
  console.log("$$routeeeers", router, router.query.id, users);

  const friends = user?.myfriends?.map((friend) => ({
    ...friend,
    isBlocked: !!user?.myblocked?.filter((user) => user.id === friend.id)[0],
  }));

  return (
    <Page title="Utilisateur" isLoading={isUsersLoading}>
      <div className="grid grid-flow-col space-x-3">
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
            {user?.pseudo}
          </span>
        </div>
        <FriendsContainer friends={friends} />
        {/* <GameHistoryContainer games={games} /> */}
      </div>
    </Page>
  );
};

export default Profil;
