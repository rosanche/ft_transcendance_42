import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Page } from "modules/common/components/_ui/Page/Page";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useAppContextState } from "modules/common/context/AppContext";
import { useUserInfosModal } from "modules/profile/components/useUserInfosModal/useUserInfosModal";
import { NotificationsContainer } from "modules/profile/components/NotificationsContainer/NotificationsContainer";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useSideBarContext } from "modules/common/context/SidebarContext";
import { GameHistoryContainer } from "modules/profile/components/GameHistoryContainer/GameHistoryContainer";
import { useGameHistoryQuery } from "modules/profile/queries/useGameHistoryQuery";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { FriendsContainer } from "modules/profile/components/FriendsContainer/FriendsContainer";
import { StatsContainer } from "modules/profile/components/StatsContainer/StatsContainer";
import { LeaderboardContainer } from "modules/profile/components/LeaderboardContainer/LeaderboardContainer";
import { AchievementsContainer } from "modules/profile/components/AchievementsContainer/AchievementsContainer";

const Profil = () => {
  const router = useRouter();
  const { data: users, isLoading, status } = useUsersQuery();
  const userId = parseInt(router.query?.id as string);
  const user = users?.find((user) => user.id === userId);
  console.log("$$routeeeers", router, router.query.id, users);

  const friends = user?.myfriends?.map((friend) => ({
    ...friend,
    isBlocked: !!user?.myblocked?.filter((user) => user.id === friend.id)[0],
  }));

  return (
    <Page title="Utilisateur" isLoading={isLoading}>
      <div className="grid grid-flow-col gap-3  space-x-3 m-2">
        <div className="flex row-start-1 col-start-1 row-span-2 flex-col items-center  mb-16 space-y-4">
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
        <div className="row-start-3 col-start-1 row-span-1">
          <StatsContainer id={userId} />
        </div>
        <FriendsContainer
          friends={user?.myfriends}
          withAddFriendButton={false}
        />
        <GameHistoryContainer id={userId} />
        <LeaderboardContainer id={userId} />
        <AchievementsContainer id={userId} />
      </div>
    </Page>
  );
};

export default Profil;
