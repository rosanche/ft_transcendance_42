import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OtpAuthentification } from "modules/auth/components/OtpAuthentification/OtpAuthentification";
import { Login } from "modules/auth/components/Login/Login";
import { Page } from "modules/common/components/_ui/Page/Page";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";

const Profil = () => {
  const router = useRouter();
  const { data, status } = useMyProfileQuery();

  console.log("$$date", data, status);

  return (
    <Page title="Profil">
      <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
        <Image
          layout="fill"
          src="/assets/img/ping-pong.png"
          className="rounded-full border border-gray-100 shadow-sm"
        />
      </div>
      <span className="text-white text-2xl font-default font-bold italic  mb-16">
        A toi de jouer Alan !
      </span>
      <RoundedContainer className="px-10 py-9">
        <div className="flex flex-row justify-between">
          <span className="text-gray-light text-sm font-default italic">
            Mes ami(e)s
          </span>
          <span className="text-white text-sm font-default italic">
            Voir tout
          </span>
        </div>
        <div>
          <FriendItem username="rosanche" status="online" />
        </div>
      </RoundedContainer>
    </Page>
  );
};

export default Profil;
