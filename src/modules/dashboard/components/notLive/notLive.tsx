import { Button } from "@/shared/components/ui/button";
import { InboxIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotLive = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full flex flex-col justify-center items-center">
      <InboxIcon width={"50px"} height={50} color="#c1c1c1" />
      <h1 className=" text-lg text-center text-gray-300">
        Nenhuma live rolando agora
      </h1>
      <span className=" text-base text-center text-gray-200">
        Inicie uma live ou volte mais tarde
      </span>

      <Button
        variant={"outline"}
        className="mt-5 hover:bg-blue-500 hover:text-white"
        onClick={() => navigate("/dashboard/live")}
      >
        Iniciar Live
      </Button>
    </main>
  );
};
