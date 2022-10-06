import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OtpAuthentification } from "modules/auth/components/OtpAuthentification/OtpAuthentification";
import { Login } from "modules/auth/components/Login/Login";
import { Page } from "modules/common/components/_ui/Page/Page";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useNewUserQuery } from "modules/auth/queries/useNewUserQuery";

const Connexion = () => {
  const router = useRouter();

  const { data: newUser, isLoading: isNewUserLoading } = useNewUserQuery();

  return (
    <Page isLoading={isNewUserLoading}>
      <Image
        width={392}
        height={175}
        layout="responsive"
        priority={true}
        src="/assets/img/ping-pong.png"
      />
      <RoundedContainer className="px-14 py-20 mt-16">
        {newUser?.is2FaEnabled ? <OtpAuthentification /> : <Login />}
      </RoundedContainer>
    </Page>
  );
};

export default Connexion;
