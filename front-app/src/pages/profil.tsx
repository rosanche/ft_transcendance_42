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
import { useNewUserQuery } from "modules/auth/queries/useNewUserQuery";

const Profil = () => {
  const { data: user, isLoading: isProfilLoading } = useMyProfileQuery({
    onError: () => {
      Cookies.remove(CookieKeys.ACCESS_TOKEN);
    },
  });
  const { data: newUser, isLoading: isNewUserLoading } = useNewUserQuery();

  const { showModal } = useUserInfosModal();

  useEffect(() => {
    newUser?.isNew && showModal();
  }, [newUser]);

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

  return (
    <Page title="Profil" isLoading={isProfilLoading || isNewUserLoading}>
      <div className="grid grid-flow-col gap-3  space-x-3 m-2">
        <div className="flex row-start-1 col-start-1 row-span-2 flex-col items-center  mb-16 space-y-4">
          <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
            <Image
              layout="fixed"
              width={176}
              height={176}
              loading="eager"
              loader={() => (urlImage || "/assets/img/42.png")}
              src={urlImage || "/assets/img/42.png"}
              priority={true}
              className="rounded-full border border-gray-100 shadow-sm"
            />
          </div>
          <span className="text-white text-2xl text-center font-default font-bold italic">
            A toi de jouer {user?.pseudo} !
          </span>
          <span className="text-pink text-2xl text-center font-default font-medium italic">
            Double authentification{" "}
            {newUser?.is2faEnabled === true ? "activé" : "désactivé"}
          </span>
          <Button variant="link" onClick={showModal}>
            Modifier
          </Button>
        </div>
        <FriendsContainer friends={friends} withAddFriendButton />
        <div className="row-start-3 col-start-1 row-span-1">
          <StatsContainer id={user?.id} />
        </div>
        <AchievementsContainer id={user?.id} />
        <GameHistoryContainer id={user?.id} />

        <NotificationsContainer friends={user?.friendReqReceive} />
        <LeaderboardContainer id={user?.id} />
      </div>
    </Page>
  );
};

export default Profil;
