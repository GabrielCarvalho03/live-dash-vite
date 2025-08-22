import { useEffect } from "react";

export function useFetchUserOnMount(
  userId: string | undefined,
  getUser: () => void
) {
  useEffect(() => {
    if (!userId) {
      getUser();
    }
  }, [userId]);
}
