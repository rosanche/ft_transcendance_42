import React from "react";
import Image from "next/image";
import { Button } from "modules/common/components/_ui/Button/Button";
import { Icon42Logo } from "modules/common/components/_icons/icons";
import { Router, useRouter } from "next/router";
import { OtpAuthentification } from "modules/auth/components/OtpAuthentification/OtpAuthentification";
import { Login } from "modules/auth/components/Login/Login";

const Connexion = () => {
  const router = useRouter();

  console.log(
    "$$query",
    router.query["2faEnabled"],
    router.query["2faEnabled"] === "true"
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Image width={392} height={175} src="/assets/img/ping-pong.png" />
      <div className="flex flex-col items-center bg-gray-dark rounded-xl shadow-right shadow-bottom px-14 py-20 mt-16">
        {router.query["2faEnabled"] === "true" ? (
          <OtpAuthentification />
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};

export default Connexion;
