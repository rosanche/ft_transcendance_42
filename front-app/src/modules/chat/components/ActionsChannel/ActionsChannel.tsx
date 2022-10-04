import React from "react";
import {
  IconAddFriend,
  IconBlock,
} from "modules/common/components/_icons/icons";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { useAddFriendModal } from "modules/profile/components/useAddFriendModal/useAddFriendModal";

const ActionsChannel = () => {
  const { chatName, changeChatName } = useChannelContext();
  const socket = useSocketContext();
  const { cha_mp } = useModeChannelMpContext();

  const { showModal: showAddUserModal } = useAddFriendModal();

  return (
    <span className="ml-1">
      {chatName.user && (
        <Button variant="contained" color="active">
          quit
        </Button>
      )}
      {!chatName.user && (
        <Button variant="contained" color="active">
          join
        </Button>
      )}
      {chatName.admin && (
        <span>
          <Button variant="contained" color="active">
            mute / ban
          </Button>
          <Button variant="contained" color="active" onClick={showAddUserModal}>
            invite
          </Button>
          {chatName.owner && (
            <span>
              <Button variant="contained" color="active">
                modif password
              </Button>
              <Button variant="contained" color="active">
                add admin
              </Button>
            </span>
          )}
        </span>
      )}
      {/*
      <Button variant="icon" color="active">
        <IconBlock />
      </Button>
      <Button variant="icon" color="active">
        <IconBlock />
      </Button>
      <Button variant="icon" color="active">
        <IconBlock />
      </Button>
      */}
    </span>
  );
};

/*
<div>
{chatName.owner && (
  <Button
    className="mb-10  px-2 py-1"
    variant="contained"
    color="active"
    onClick={() => setNewAdmin(!newAdmin)}
  >
    add admin
  </Button>
)}
</div>
{newAdmin && (
  <h3>
    new admin :
    <input
      className=" px-2 py-1"
      type="text"
      value={ban.pseudo}
      onChange={(e) => {
        setBan({
          mute_ban: "",
          name: chatName.name,
          pseudo: e.target.value,
          time: ban.time,
          motif: "",
        });
      }}
      placeholder="Enter new owner"
      name="chat"
    />
    {ban.pseudo !== "" && (
      <Button
        className="mb-10  px-2 py-1"
        variant="contained"
        color="active"
        onClick={() => addAdmin(ban)}
      >
        envoie
      </Button>
    )}
  </h3>
)}
<Button
  className="mb-10  px-2 py-1"
  variant="contained"
  color="active"
  onClick={() => log(data)}
>
  blocked
</Button>
<Button
  className="mb-10  px-2 py-1"
  variant="contained"
  color="active"
  onClick={() =>
    setBan({
      mute_ban: "mute",
      name: chatName.name,
      pseudo: ban.pseudo,
      time: ban.time,
      motif: ban.motif,
    })
  }
>
  mute
</Button>
<Button
  className="mb-10  px-2 py-1"
  variant="contained"
  color="active"
  onClick={() => setInvite(!invite)}
>
  invite user
</Button>
*/
export default ActionsChannel;
