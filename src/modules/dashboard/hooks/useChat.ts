import { create } from "zustand";
import { useChatProps } from "./types";
import { push, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useLive } from "@/modules/live/hooks/useLive";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

export const useChat = create<useChatProps>((set) => ({
  allMessages: [],
  setAllMessages: () => set({ allMessages: [] }),
  handleSendMessage: async ({ messageText, liveId, setMessageText }) => {
    const { liveList } = useLive.getState();
    const { user } = useLogin.getState();

    const actualLive = liveList?.find((live) => live._id === liveId);

    if (!messageText.trim()) return;
    const chatRef = ref(db, `chat/${liveId}`);
    setMessageText("");

    await push(chatRef, {
      id: new Date().getTime(),
      user: user?.name,
      avatar: user?.avatar,
      message: messageText,
      admin: user?.userType === "Admin" ? true : false,
      creator: user?._id === actualLive?.userId ? true : false,
      time: new Date().toISOString(),
    }); // Lógica para enviar mensagem
  },
}));
