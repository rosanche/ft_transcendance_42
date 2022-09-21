import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OtpAuthentification } from "modules/auth/components/OtpAuthentification/OtpAuthentification";
import { Login } from "modules/auth/components/Login/Login";
import { Page } from "modules/common/components/_ui/Page/Page";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";

const Profil = () => {
  const router = useRouter();
  const { data, status } = useMyProfileQuery();

  console.log("$$date", data, status);

  const Content = () => (
  <div><div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
  <Image
    layout="fill"
    src="/assets/img/ping-pong.png"
    className="rounded-full border border-gray-100 shadow-sm"
  />
</div>
<span className="text-white text-2xl font-default font-bold italic">
  A toi de jouer Alan !
</span>
<span className="text-pink text-2xl font-default font-medium italic">
Double authentification désactivé
</span>
<Button variant="link">Modifier</Button>
</div>
)

  const { showModal } = useContentModal({ content: <Content />, headerTitle: "Modifier mon profil"  });

  return (
    <Page title="Profil">
      <div className="flex flex-col items-center  mb-16 space-y-4">
      <div className="flex relative rounded-full border border-gray-100 w-44 h-44 shadow-sm">
        <Image
          layout="fill"
          src="/assets/img/ping-pong.png"
          className="rounded-full border border-gray-100 shadow-sm"
        />
      </div>
      <span className="text-white text-2xl font-default font-bold italic">
        A toi de jouer Alan !
      </span>
      <span className="text-pink text-2xl font-default font-medium italic">
      Double authentification désactivé
      </span>
      <Button variant="link" onClick={showModal}>Modifier</Button>
      </div>
      <RoundedContainer className="px-10 py-9" title="Mes ami(e)s" button={<Button variant="link">Voir tout</Button>}>
        
          <FriendItem username="rosanche" status="online" />
      </RoundedContainer>
    </Page>
  );
};

export default Profil;
