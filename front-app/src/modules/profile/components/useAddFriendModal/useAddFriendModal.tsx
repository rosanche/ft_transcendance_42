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
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FriendItem } from "../FriendItem/FriendItem";

interface FormData {
  searchTerm: string;
}

export const useAddFriendModal = () => {
  const { formState, register, watch } = useForm<FormData>({
    defaultValues: {
      searchTerm: "",
    },
  });
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
              friend.id !== profil?.id && (
                <FriendItem {...friend} type="friend" />
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
    headerTitle: "Ajouter un ami(e)",
  });
};
