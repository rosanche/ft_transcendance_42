import React from "react";
import Image from "next/image";
import { Button } from "modules/common/components/_ui/Button/Button";
import { Icon42Logo } from "modules/common/components/_icons/icons";

const Connexion = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Image width={392} height={175} src="/assets/img/ping-pong.png" />
      <div className="flex flex-col items-center bg-gray-dark rounded-xl shadow-right shadow-bottom px-14 py-20 mt-16">
        <span className="text-white text-4xl font-default font-bold italic mb-16">
          Il est temps de gagner des points !
        </span>
        <Button variant="contained" color="active" icon={<Icon42Logo />}>
          Se connecter
        </Button>
      </div>
    </div>
  );
};

export default Connexion;
