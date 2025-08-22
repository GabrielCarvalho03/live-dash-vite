import { ref, set } from "firebase/database";
import { toast } from "sonner";
import { db } from "@/lib/firebase";

export function useHandleProductDragEnd(
  liveId: string | undefined,
  highlightedProductList: any[],
  setHighlightedProductList: (list: any[]) => void
) {
  return async (event: any) => {
    if (!liveId) return;
    const productsRef = ref(db, `products/${liveId}`);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = highlightedProductList.findIndex(
      (item) => item._id === active.id
    );
    const newIndex = highlightedProductList.findIndex(
      (item) => item._id === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const newList = [...highlightedProductList];
      const [moved] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, moved);
      setHighlightedProductList(newList);

      await set(productsRef, {
        products: newList,
      });

      toast.success("Ordem dos produtos atualizada com sucesso!", {
        duration: 3000,
      });
    }
  };
}
