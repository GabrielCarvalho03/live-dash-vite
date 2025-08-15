import { user } from "@/modules/auth/hooks/useLoginHook/types";
import { useLive } from "@/modules/live/hooks/useLive";
import { useUser } from "@/modules/users/hooks/useUser";

export const GetLiveForUserOrAdmin = async (user: user | null) => {
  const { handleGetLive, handleGetLiveByUser } = useLive.getState();
  const { getUSerVinculateLive } = useUser.getState();
  if (user?.userType === "Admin") {
    const live = await handleGetLive();

    if (live?.length) {
      getUSerVinculateLive(live && live[0]);
    }
    return;
  }
  if (user?.userType === "User") {
    const liveByUser = await handleGetLiveByUser(user?._id);
    if (liveByUser?.length) {
      await getUSerVinculateLive(liveByUser && liveByUser[0]);
    }
  }
};
