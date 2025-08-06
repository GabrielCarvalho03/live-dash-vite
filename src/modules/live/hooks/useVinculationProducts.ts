import { create } from "zustand";
import { allVinculationProductsObj, VinculationProduct } from "./types";
import { toast } from "sonner";
import { LiveApi } from "@/lib/api/liveApi";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { useLive } from "./useLive";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

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

  vinculationProductsObject: {} as allVinculationProductsObj,
  setVinculationProductsObject: (
    vinculationProductsObject: allVinculationProductsObj
  ) => set({ vinculationProductsObject }),

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

  openDeleteVinculationProductModal: false,
  setOpenDeleteVinculationProductModal: (value) =>
    set({ openDeleteVinculationProductModal: value }),

  loadingDeleteVinculationProducts: false,
  setLoadingDeleteVinculationProducts: (
    loadingDeleteVinculationProducts: boolean
  ) => set({ loadingDeleteVinculationProducts }),

  handleDeleteVinculationProduct: async (data) => {
    const { user } = useLogin.getState();
    const {
      allVinculationProducts,
      setLoadingDeleteVinculationProducts,
      setAllViculationProducts,
      setOpenDeleteVinculationProductModal,
    } = useVinculationProductsLive.getState();
    try {
      setLoadingDeleteVinculationProducts(true);

      await LiveApi.post("/live/product/delete", {
        userId: user?._id,
        productId: data._id,
      });

      const newList = allVinculationProducts.filter(
        (item) => item._id !== data._id
      );

      setAllViculationProducts(newList);

      setOpenDeleteVinculationProductModal(false);

      toast.success("Deletado com sucesso", {
        description: `Produto ${data.name} foi deletado.`,
      });
      console.log("data", data);
    } catch (error: any) {
      toast.error("Erro ao deletar produto vinculado.", {
        description: `${error.response.data.error}`,
      });
    } finally {
      setLoadingDeleteVinculationProducts(false);
    }

    return;
  },
}));
