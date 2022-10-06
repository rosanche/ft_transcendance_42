import { useContentModal } from "modules/common/components/modals/useContentModal/useContentModal";
import { Button } from "modules/common/components/_ui/Button/Button";
import { Spinner } from "modules/common/components/_ui/Spinner/Spinner";
import { TextField } from "modules/common/components/_ui/TextField/TextField";
import { useAppContextState } from "modules/common/context/AppContext";
import { useActivate2Fa } from "modules/profile/mutation/useActivate2Fa.mutation";
import { useGenerate2Fa } from "modules/profile/mutation/useGenerate2Fa.mutation";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FriendItem } from "../FriendItem/FriendItem";

interface FormData {
  searchTerm: string;
}

export const useAddFriendModal = ({
  title = "Ajouter un ami(e)",
  isInChannel = false,
  idsToAvoid = [],
  channelId = 0,
  isChangeOnMember = false,
}: {
  title?: string;
  isInChannel?: boolean;
  channelId?: number;
  idsToAvoid?: number[];
  isChangeOnMember?: boolean;
}) => {
  const { formState, register, watch } = useForm<FormData>({
    defaultValues: {
      searchTerm: "",
    },
  });
  console.log("$$BOBNJOUUURR", idsToAvoid);
  const { errors } = formState;
  const { data: users, isLoading, status } = useUsersQuery();
  const { data: profil } = useMyProfileQuery();

  const searchTerm = watch("searchTerm");

  console.log(
    "$$data almost here2",
    users,
    status,
    users,
    users
      ?.filter((value) => value != null)
      .filter((value) => {
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
  );

  console.log(
    "$$users Addmodal bordel",
    users,
    users?.map(
      (friend) =>
        friend.id !== profil?.id && idsToAvoid.some((id) => id !== friend.id)
    ),
    idsToAvoid.some((idMember) => idMember === 1),
    idsToAvoid
  );

  const usersFiltered = useMemo(
    () =>
      users
        ?.filter((value) => value != null)
        .filter((value) => {
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        }),
    [searchTerm]
  );

  const UsersList = () => (
    <div className="flex flex-col">
      {!isLoading ? (
        <>
          {/* <TextField
            id="Rechercher un ami"
            {...register("searchTerm")}
            error={errors.searchTerm}
            placeholder="Rechercher un utilisateur..."
          /> */}
          {users?.map(
            (friend) =>
              friend.id !== profil?.id &&
              (!isInChannel || idsToAvoid.some((id) => id !== friend.id)) && (
                <FriendItem
                  {...friend}
                  type="friend"
                  isIn={isInChannel ? "channel" : undefined}
                  channelId={channelId}
                  isChangeOnMember={isChangeOnMember}
                  isBlocked={false}
                />
              )
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );

  return useContentModal({
    content: <UsersList />,
    headerTitle: title,
  });
};
