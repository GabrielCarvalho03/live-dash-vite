import { useLive } from "@/modules/live/hooks/useLive";
import { Button } from "@/shared/components/ui/button";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { ShoppingBasket } from "lucide-react";
import { toast } from "sonner";

export const NotProductsInHighlight = () => {
  const { setOpenModalCreateProducts } = useCreateProductsDrawer();
  const { liveList } = useLive();
  const livesAtivas = liveList?.filter((item) => item.status == "live");
  return (
    <main className="w-full mt-32 flex flex-col justify-center items-center">
      <ShoppingBasket width={"50px"} height={50} color="#c1c1c1" />
      <h1 className=" text-2xl text-center text-gray-300 ">
        Sem produtos em destaque
      </h1>
      <span className=" text-lg text-center text-gray-200">
        Clique em adicionar produtos para destacar os produtos da sua live
      </span>

      <Button
        variant={"outline"}
        className="mt-5 hover:bg-blue-500 hover:text-white w-40"
        onClick={() => {
          if (!livesAtivas.length) {
            toast.error("Não é possivel adicionar produtos", {
              description: "Você precisa de pelo menos uma live ativa.",
            });

            return;
          }
          setOpenModalCreateProducts(true);
        }}
      >
        Adicionar produtos
      </Button>
    </main>
  );
};
