import { ScreenShareOff } from "lucide-react";

export const NotFoundTable = () => {
  return (
    <main className="w-full mt-20 flex flex-col justify-center items-center">
      <ScreenShareOff width={"100px"} height={100} color="#c1c1c1" />
      <h1 className=" text-2xl text-gray-200">Parece que não tem dados</h1>
      <span className=" text-2xl text-gray-200">
        Recarregue a página ou volte mais tarde.
      </span>
    </main>
  );
};
