import React, { useState, useRef, useEffect } from "react";
import {
  IconAddFriend,
  IconBlock,
} from "modules/common/components/_icons/icons";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { useAddFriendModal } from "modules/profile/components/useAddFriendModal/useAddFriendModal";
import IconEye from "modules/common/components/_icons/eye";
import IconAdmin from "modules/common/components/_icons/admin";
import IconEdit from "modules/common/components/_icons/edit";
import IconEnter from "modules/common/components/_icons/enter";
import IconQuit from "modules/common/components/_icons/quit";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";

interface Props {
  usersChannelId: number[];
}

const ActionsChannel = (a: Props) => {
  const { chatName, changeChatName } = useChannelContext();
  const socket = useSocketContext();
  const { cha_mp } = useModeChannelMpContext();
  const [password, setPassWord] = useState<string>("");
  const [adminMode, setAdminMode] = useState<number>(0);
  const [idsMember, setIdsMember] = useState<number[]>([]);
  const [pass, setPass] = useState<string>(null);
  const { data: users, isLoading, status } = useUsersQuery();
  const { showModal: showAddUserModal } = useAddFriendModal({
    isInChannel: true,
    idsToAvoid: idsMember,
    channelId: chatName.id,
  });
  const { showModal: showBanUserModal } = useAddFriendModal({
    isInChannel: true,
    idsToAvoid: users?.filter(({ id }) =>
      idsMember.some((idNotMember) => idNotMember !== id)
    ),
    channelId: chatName.id,
  });

  const changePassword = () => {
    socket.emit("modif channel", {
      idChannel: chatName.id,
      password: password,
    });
    setPassWord("");
  };

  useEffect(() => {
    // socket.emit("list users channel", chatName.id);

    socket.on("channel users", (ids: number[]) => {
      console.log("$$ids babe", ids);
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
    console.log();
    await socket.emit("quit", chatName.id);
  };

  const block = async () => {
    console.log(chatName.id);
    // await socket.emit("list users channel", chatName.id);
    console.log(a.usersChannelId);
    setAdminMode(1);
  };

  return (
    <div>
      <span>
        {cha_mp == "channel" && chatName.name != null && (
          <span className="ml-1">
            {chatName.user && (
              <Button
                variant="icon"
                color="active"
                onClick={() => {
                  quit();
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
                      console.log(pass);
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
                    showBanUserModal();
                  }}
                >
                  <IconBlock />
                </Button>
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
                {chatName.owner && (
                  <span>
                    <Button
                      variant="icon"
                      color="active"
                      onClick={() => {
                        setAdminMode(2);
                      }}
                    >
                      <IconEdit />
                    </Button>
                    <Button
                      variant="icon"
                      color="active"
                      onClick={() => {
                        setAdminMode(3);
                      }}
                    >
                      <IconAdmin />
                    </Button>
                  </span>
                )}
              </span>
            )}
            <div>
              {/* {adminMode === 1 && (
                <div>
                  {users
                    ?.filter(
                      (el) => a.usersChannelId?.find(el.id) === undefined
                    )
                    .map((element, i) => (
                      <FriendItem {...element} />
                    ))}
                </div>
              )} */}

              {adminMode === 2 && (
                <div>
                  <input
                    className=" px-2 py-1 text-black"
                    type="password"
                    value={password}
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
              {adminMode === 3 && <div></div>}
            </div>
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
