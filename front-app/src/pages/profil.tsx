import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { Page } from "modules/common/components/_ui/Page/Page";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { FriendsContainer } from "modules/profile/components/FriendsContainer/FriendsContainer";
import { useAppContextState } from "modules/common/context/AppContext";
import { useUserInfosModal } from "modules/profile/components/useUserInfosModal/useUserInfosModal";
import { NotificationsContainer } from "modules/profile/components/NotificationsContainer/NotificationsContainer";
import { GameHistoryContainer } from "modules/profile/components/GameHistoryContainer/GameHistoryContainer";
import Cookies from "js-cookie";
import { CookieKeys } from "modules/common/types";
import { StatsContainer } from "modules/profile/components/StatsContainer/StatsContainer";
import { AchievementsContainer } from "modules/profile/components/AchievementsContainer/AchievementsContainer";
import { LeaderboardContainer } from "modules/profile/components/LeaderboardContainer/LeaderboardContainer";

const Profil = () => {
  const { data: user, isLoading: isProfilLoading } = useMyProfileQuery({
    onError: () => {
      Cookies.remove(CookieKeys.ACCESS_TOKEN);
    },
  });
  const { doubleFaEnabled } = useAppContextState();
  console.log("$$date", user);

  const { showModal } = useUserInfosModal();

  // useEffect(() => {
  //   !user?.profileImage && showModal();
  // }, []);

  const friends = user?.myfriends?.map((friend) => ({
    ...friend,
    isBlocked: !!user?.myblocked?.filter((user) => user.id === friend.id)[0],
  }));

  const urlImage = useMemo(
    () =>
      user?.profileImage &&
      `http://localhost:3000/users/me/pp/${user?.profileImage}`,
    [user?.profileImage]
  );
  console.log("$$usersssss", user);

  return (
    <Page title="Profil" isLoading={isProfilLoading}>
      <div className="grid grid-flow-row grid-flow-col gap-3  space-x-3 m-2">
        <div className="flex row-start-1 col-start-1 row-span-2 flex-col items-center  mb-16 space-y-4">
          <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
            <Image
              layout="fill"
              unoptimized={true}
              loader={() => urlImage || "/assets/img/42.png"}
              src={urlImage || "/assets/img/42.png"}
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
        <div className="row-start-3 col-start-1 row-span-1">
          <StatsContainer id={user?.id} />
        </div>
        <FriendsContainer friends={friends} withAddFriendButton />
        <GameHistoryContainer id={user?.id} />

        <LeaderboardContainer id={user?.id} />
        <NotificationsContainer friends={user?.friendReqReceive} />
        <AchievementsContainer id={user?.id} />
      </div>
    </Page>
  );
};

export default Profil;
