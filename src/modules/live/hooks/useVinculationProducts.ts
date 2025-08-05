import { create } from "zustand";
import { VinculationProduct } from "./types";
import { toast } from "sonner";
import { LiveApi } from "@/lib/api/liveApi";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { useLive } from "./useLive";

export const useVinculationProductsLive = create<VinculationProduct>((set) => ({
  loadingVinculationProduct: false,
  setLoadingVinculationProduct: (value) =>
    set({ loadingVinculationProduct: value }),

  loadingisGetAllVinculationProduct: false,
  setLoadingisGetAllVinculationProduct: (value) =>
    set({ loadingisGetAllVinculationProduct: value }),

  allVinculationProducts: [],
  setAllViculationProducts: (value) => set({ allVinculationProducts: value }),
  handleGetAllVinculationProduct: async () => {
    const { setLoadingisGetAllVinculationProduct, setAllViculationProducts } =
      useVinculationProductsLive.getState();

    const token = GetTokenUser();
    try {
      setLoadingisGetAllVinculationProduct(true);
      const reponse = await LiveApi.get("/live/product/all", {
        headers: {
          Authorization: token,
        },
      });
      console.log("alllives", reponse.data.data);
      setAllViculationProducts(reponse.data.data);
    } catch (error: any) {
      toast.error("Error ao buscar produtos vinculado", {
        description: `${error.response.data.error}`,
      });
    } finally {
      setLoadingisGetAllVinculationProduct(false);
    }
  },

  handleAddVinculationProduct: async (data) => {
    const { setLoadingVinculationProduct } =
      useVinculationProductsLive.getState();
    const { liveEditObject } = useLive.getState();
    const token = GetTokenUser();
    try {
      setLoadingVinculationProduct(true);

      const objToCreateVinculationProduct = {
        products: data.products,
        userId: liveEditObject?.userId,
        liveId: liveEditObject?._id,
      };

      const res = await LiveApi.post(
        "/live/product/vinculation",
        objToCreateVinculationProduct,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success("Produto vinculado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao vincular produto", {
        description: `${error.response.data.error}`,
      });
    } finally {
      setLoadingVinculationProduct(false);
    }
  },
}));
