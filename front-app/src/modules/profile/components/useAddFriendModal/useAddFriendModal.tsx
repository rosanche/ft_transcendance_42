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
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FriendItem } from "../FriendItem/FriendItem";

interface FormData {
  search: string;
}

export const useAddFriendModal = () => {
  const { formState, register } = useForm<FormData>({
    defaultValues: {
      search: "",
    },
  });
  const { errors } = formState;
  const { data: users, isLoading, status } = useUsersQuery();
  const {
    data: { id: myId },
  } = useMyProfileQuery();

  console.log("$$data almost here2", users, status, users);
  // useEffect(() => {}, []);

  const UsersList = () => (
    <div className="flex flex-col">
      {!isLoading ? (
        <>
          <TextField
            id="Rechercher un ami"
            {...register("search")}
            error={errors.search}
          />
          {users?.map(
            (friend) =>
              friend.id !== myId && <FriendItem {...friend} type="friend" />
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
