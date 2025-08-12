import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

export const ChatComponent = () => {
  const { user } = useLogin();

  return (
    <main className="w-6/12 h-full ">
      <div className="w-full  max-h-[270px] min-h-[270px] overflow-y-auto">
        <span className="font-semibold text-lg ">Chat da live</span>

        <div className="w-full mt-10 flex flex-col gap-7">
          {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((item) => (
            <div>
              <div className="w-full flex gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={user?.avatar} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold ">Gabriel</span>
              </div>
              <p className="text-xs text-gray-600">Essa live ta show!!</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
