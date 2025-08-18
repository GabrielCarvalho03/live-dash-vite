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
    const chatRef = ref(db, `chat/${liveId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      console.log("chat", data);
      if (data) {
        // Converte o objeto em array de mensagens
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
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const chatRef = ref(db, `chat/${liveId}`);
    setMessageText("");

    await push(chatRef, {
      userName: user?.name,
      avatar: user?.avatar,
      message: messageText,
      admin: user?.userType === "Admin" ? true : false,
      Creator: user?._id === actualLive?.userId ? true : false,
      time: new Date().toISOString(),
    });
  };

  return (
    <main className="w-6/12 h-full ">
      <div className="w-full  max-h-[270px] min-h-[270px] overflow-y-auto">
        <span className="font-semibold text-lg ">Chat da live</span>

        <div className="w-full mt-10 flex flex-col gap-7">
          {allMessages?.map((item: any) => (
            <div>
              <div className="w-full flex gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.avatar} alt="@shadcn" />
                  <AvatarFallback className="text-xs">A</AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold ">
                  {item.userName}{" "}
                  {item.admin ? (
                    <span className="px-[4px] py-1   text-red-500 rounded-full text-[10px]">
                      {""}
                      Admin
                    </span>
                  ) : item.Creator ? (
                    <span className="px-[4px] py-1 -pt-[30px]  text-blue-500 rounded-full text-[10px]">
                      {" "}
                      Criador
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-600">{item.message}</p>
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
