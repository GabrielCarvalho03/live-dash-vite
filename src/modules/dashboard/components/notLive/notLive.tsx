import { useLive } from "@/modules/live/hooks/useLive";
import { Button } from "@/shared/components/ui/button";
import { InboxIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotLive = () => {
  const navigate = useNavigate();
  const { liveList, setLiveListFilter } = useLive.getState();
  return (
    <main className="w-full pt-32 flex flex-col justify-center items-center">
      <InboxIcon width={"50px"} height={50} color="#c1c1c1" />
      <h1 className=" text-2xl text-center text-gray-300 ">
        Nenhuma live rolando agora
      </h1>
      <span className=" text-lg text-center text-gray-200">
        Inicie uma live ou volte mais tarde
      </span>

      <Button
        variant={"outline"}
        className="mt-5 hover:bg-blue-500 hover:text-white w-40"
        onClick={() => {
          setLiveListFilter(liveList);
          navigate("/dashboard/live");
        }}
      >
        Iniciar Live
      </Button>
    </main>
  );
};
