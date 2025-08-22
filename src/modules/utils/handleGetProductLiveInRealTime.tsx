import { productObject } from "@/shared/hooks/useCreateProductsDrawer/types";
import { useEffect } from "react";
import { off, onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
export type handleGetProductLiveInRealTimeProps = {
  liveId: string;
  setHighlightedProductList: (highlightedProductList: productObject[]) => void;
};

export function handleGetProductLiveInRealTime(
  liveId: string | undefined,
  setHighlightedProductList: (products: any[]) => void
) {
  useEffect(() => {
    if (!liveId) return;

    const productsRef = ref(db, `products/${liveId}`);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      let productsArray = [];
      if (data) {
        if (Array.isArray(data.products)) productsArray = data.products;
        else if (typeof data.products === "object")
          productsArray = Object.values(data.products);
        else if (Array.isArray(data)) productsArray = data;
        else if (typeof data === "object") productsArray = Object.values(data);
      }
      setHighlightedProductList(productsArray);
    });

    return () => {
      off(productsRef);
      unsubscribe();
    };
  }, [liveId, setHighlightedProductList]);
}
