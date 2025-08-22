import { useEffect, useState, useRef } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { db } from "@/lib/firebase";
import { ref, onValue, off, push } from "firebase/database";
import { Input } from "@/shared/components/ui/input";
import { Send } from "lucide-react";
import { useLive } from "@/modules/live/hooks/useLive";

type ChatComponentProps = {
  liveId: string;
};

export const ChatComponent = ({ liveId }: ChatComponentProps) => {
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { user } = useLogin();
  const { liveList } = useLive();

  const actualLive = liveList?.find((live) => live._id === liveId);

  useEffect(() => {
    setAllMessages([]);

    const chatRef = ref(db, `live_chat/${liveId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setAllMessages(messagesArray);
      } else {
        setAllMessages([]);
      }
    });

    return () => {
      off(chatRef);
      unsubscribe();
    };
  }, [liveId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const chatRef = ref(db, `live_chat/${liveId}`);
    setMessageText("");

    await push(chatRef, {
      userId: user?._id,
      user: user?.name,
      avatar: user?.avatar,
      text: messageText,
      admin: user?.userType === "Admin" ? true : false,
      creator: user?._id === actualLive?.userId ? true : false,
      time: new Date().toISOString(),
    });
  };

  return (
    <main className="w-6/12 h-full max-h-[400px] flex flex-col">
      <div className="w-full flex-1 min-h-[270px] max-h-[270px] overflow-y-auto">
        <span className="font-semibold text-lg ">Chat da live</span>

        <div className="w-full mt-10 flex flex-col gap-7">
          {allMessages?.map((item: any) => (
            <div key={item.id}>
              <div className="w-full flex gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.avatar} alt="@shadcn" />
                  <AvatarFallback className="text-xs">A</AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold ">
                  {item.user}{" "}
                  {item.admin ? (
                    <span className="px-[4px] py-1   text-red-500 rounded-full text-[10px]">
                      {""}
                      Admin
                    </span>
                  ) : item.creator ? (
                    <span className="px-[4px] py-1 -pt-[30px]  text-blue-500 rounded-full text-[10px]">
                      {" "}
                      Criador
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
      <div className="flex w-full items-center gap-2 mt-2">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Digite sua mensagem..."
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 rounded text-white hover:bg-blue-600"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
};
