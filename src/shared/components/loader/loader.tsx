import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-12 h-12  text-blue-500 animate-spin " />
    </div>
  );
};
