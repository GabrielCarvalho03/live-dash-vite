import { useEffect, useRef } from "react";
import { GetLiveForUserOrAdmin } from "@/shared/utils/getLiveForUserOrAdmin";

export function useFetchLivesForUser(user: any, liveList: any[]) {
  const hasFetchedLives = useRef(false);

  useEffect(() => {
    if (hasFetchedLives.current) return;
    if (!liveList.length) {
      GetLiveForUserOrAdmin(user);
      hasFetchedLives.current = true;
    }
  }, [user?._id, liveList]);
}
