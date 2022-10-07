import React, { useState, useEffect } from "react";
import {
  IconAddFriend,
  IconDots,
} from "modules/common/components/_icons/icons";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { useAddFriendModal } from "modules/profile/components/useAddFriendModal/useAddFriendModal";
import IconEdit from "modules/common/components/_icons/edit";
import IconEnter from "modules/common/components/_icons/enter";
import IconQuit from "modules/common/components/_icons/quit";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Channel } from "modules/chat/types";

interface Props {
  usersChannelId: number[];
}

const ActionsChannel = () => {
  const { chatName, changeChatName } = useChannelContext();
  const socket = useSocketContext();
  const { cha_mp } = useModeChannelMpContext();
  const [password, setPassWord] = useState<string>("");
  const [adminMode, setAdminMode] = useState<number>(0);
  const [idsMember, setIdsMember] = useState<number[]>([]);
  const [modifPassword, setModifPassword] = useState<Boolean>(false);
  const [pass, setPass] = useState<string>("");
  const { data: users, isLoading, status } = useUsersQuery();
  const { showModal: showAddUserModal } = useAddFriendModal({
    title: "Ajouter un utilisateur dans le channel",
    isInChannel: true,
    idsToAvoid: idsMember,
    usersChannel: false,
    channelId: chatName.id,
  });
  const { showModal: showChangeMemberModal } = useAddFriendModal({
    title: "Ban un membre du channel",
    isInChannel: true,
    idsToAvoid: idsMember,
    usersChannel: true,
    channelId: chatName.id,
    isChangeOnMember: true,
  });
  const { showModal: showChangeOwnerModal } = useAddFriendModal({
    title: "Changer le owner du channel",
    isInChannel: true,
    idsToAvoid: idsMember,
    usersChannel: true,
    channelId: chatName.id,
    isChangeOnMember: true,
  });
  const changePassword = () => {
    socket.emit("modif channel", {
      idChannel: chatName.id,
      password: password,
    });
    setPassWord("");
    setModifPassword(false);
  };

  /*useEffect(() => {
    socket.on("channel users", (ids: number[]) => {

      setIdsMember(ids);
    });

  }, [chatName]);*/

  useEffect(() => {
    socket.on("channel users", (ids: number[]) => {
      setIdsMember(ids);
    });
  }, [socket]);

  const join = async () => {
    await socket.emit("joins channel", {
      idChannel: chatName.id,
      name: "",
      password: pass,
      private: chatName,
    });
  };

  const quit = async () => {
    if (!chatName.owner) await socket.emit("quit", chatName.id);
    else await socket.emit("quit", chatName.id);
  };

  const block = async () => {
    // await socket.emit("list users channel", chatName.id);

    setAdminMode(1);
  };

  return (
    <div>
      <span>
        {cha_mp == "channel" && chatName.name != null && chatName.name != "" && (
          <span className="ml-1">
            {chatName.user && (
              <Button
                variant="icon"
                color="active"
                onClick={() => {
                  if (!socket.connected) {
                    socket.connect();
                  }
                  socket.emit("list users channel", chatName.id);
                  idsMember.length != 1 && chatName.owner
                    ? showChangeOwnerModal()
                    : quit();
                }}
              >
                <IconQuit />
              </Button>
            )}
            {!chatName.user && (
              <span>
                {chatName.password === true && (
                  <input
                    className="text-black"
                    type="password"
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                    placeholder="Enter password"
                    onKeyPress={(event) => {
                      event.key === "Enter" && join();
                    }}
                  ></input>
                )}
                <Button
                  variant="icon"
                  color="active"
                  onClick={() => {
                    join();
                  }}
                >
                  <IconEnter />
                </Button>
              </span>
            )}
            {chatName.admin && (
              <span>
                <Button
                  variant="icon"
                  color="active"
                  onClick={() => {
                    socket.emit("list users channel", chatName.id);

                    showAddUserModal();
                  }}
                >
                  <IconAddFriend />
                </Button>
                {chatName.owner && !chatName.private && (
                  <span>
                    <Button
                      variant="icon"
                      color="active"
                      onClick={() => {
                        setModifPassword(!modifPassword);
                      }}
                    >
                      <IconEdit />
                    </Button>
                  </span>
                )}
                <Button
                  variant="icon"
                  color="active"
                  onClick={() => {
                    socket.emit("list users channel", chatName.id);
                    showChangeMemberModal();
                  }}
                >
                  <IconDots />
                </Button>
              </span>
            )}
            <div>
              {modifPassword && (
                <div>
                  <input
                    className=" px-2 py-1 text-black"
                    type="password"
                    value={password || ""}
                    onChange={(e) => {
                      setPassWord(e.target.value);
                    }}
                    onKeyPress={(event) => {
                      event.key === "Enter" && changePassword();
                    }}
                    placeholder="Enter password"
                    name="chat"
                  />
                </div>
              )}
            </div>
          </span>
        )}
      </span>
    </div>
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
      name="chat"  const { usersChannel, ChangeUsersChannel } = useUsersChannelContext();
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
