import { InboxIcon } from "lucide-react";

export const NotComentLives = () => {
  return (
    <main className="w-full mt-20 flex flex-col justify-center items-center">
      <InboxIcon width={"50px"} height={100} color="#c1c1c1" />
      <h1 className=" text-lg text-center text-gray-300">
        Ainda não tem nenhuma mensagem
      </h1>
      <span className=" text-base text-center text-gray-200">
        As mensages do chat aparecerão aqui.
      </span>
    </main>
  );
};
