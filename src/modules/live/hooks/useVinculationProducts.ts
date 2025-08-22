import { create } from "zustand";
import { allVinculationProductsObj, VinculationProduct } from "./types";
import { toast } from "sonner";
import { LiveApi } from "@/lib/api/liveApi";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { useLive } from "./useLive";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { arrayMove } from "@dnd-kit/sortable";

export const useVinculationProductsLive = create<VinculationProduct>((set) => ({
  loadingVinculationProduct: false,
  setLoadingVinculationProduct: (value) =>
    set({ loadingVinculationProduct: value }),

  loadingisGetAllVinculationProduct: false,
  setLoadingisGetAllVinculationProduct: (value) =>
    set({ loadingisGetAllVinculationProduct: value }),

  allVinculationProductsFiltered: [],
  setAllViculationProductsFiltered: (allVinculationProductsFiltered) =>
    set({ allVinculationProductsFiltered }),

  allVinculationProducts: [],
  setAllViculationProducts: (value) => set({ allVinculationProducts: value }),
  handleGetAllVinculationProduct: async () => {
    const {
      setLoadingisGetAllVinculationProduct,
      setAllViculationProducts,
      setAllViculationProductsFiltered,
    } = useVinculationProductsLive.getState();

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
      setAllViculationProductsFiltered(reponse.data.data);
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
    const {
      allVinculationProducts,
      setLoadingVinculationProduct,
      setAllViculationProducts,
      setAllViculationProductsFiltered,
    } = useVinculationProductsLive.getState();
    const { liveEditObject } = useLive.getState();
    const token = GetTokenUser();
    try {
      setLoadingVinculationProduct(true);

      const dataToSave = {
        _id: data.id,
        name: data.name,
        link: data.link,
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        price: data.price,
        imageMain: data.imageMain,
        imagesSecondary: data.imagesSecondary,
        liveId: data.liveId,
        userId: data.userId,
      };

      const objToCreateVinculationProduct = {
        products: [
          {
            ...dataToSave,
          },
        ],
        userId: data?.userId,
        liveId: data?.liveId ?? liveEditObject?._id,
      };

      await LiveApi.post(
        "/live/product/vinculation",
        objToCreateVinculationProduct,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAllViculationProducts([...allVinculationProducts, dataToSave]);
      setAllViculationProductsFiltered([...allVinculationProducts, dataToSave]);

      toast.success("Produto vinculado com sucesso", {
        description: `O produto ${data.name} foi vinculado com sucesso!`,
      });
    } catch (error: any) {
      toast.error("Erro ao vincular produto", {
        description: `${error.response.data.message}`,
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

  handleDeleteVinculationProduct: async (data, index) => {
    const { user } = useLogin.getState();
    const {
      allVinculationProducts,
      setLoadingDeleteVinculationProducts,
      setAllViculationProducts,
      setAllViculationProductsFiltered,
      setOpenDeleteVinculationProductModal,
      removeProduct,
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
      setAllViculationProductsFiltered(newList);
      setOpenDeleteVinculationProductModal(false);
      if (index) {
        removeProduct(index);
      }
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

  listProductsEdited: [],
  setListProductsEdited: (listProductsEdited) => set({ listProductsEdited }),

  handleChange: (
    index: number,
    field: keyof allVinculationProductsObj,
    value: string
  ) => {
    const { listProductsEdited, setListProductsEdited } =
      useVinculationProductsLive.getState();
    const updated = [...listProductsEdited];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setListProductsEdited(updated);
  },

  addProduct: () => {
    const { listProductsEdited, setListProductsEdited } =
      useVinculationProductsLive.getState();
    setListProductsEdited([
      ...listProductsEdited,
      {
        name: "",
        link: "",
        hourStart: "",
        hourEnd: "",
        _id: "",
        liveId: "",
        userId: "",
      },
    ]);
  },
  removeProduct: (index: number) => {
    const { listProductsEdited, setListProductsEdited } =
      useVinculationProductsLive.getState();
    const updated = [...listProductsEdited];
    updated.splice(index, 1);
    setListProductsEdited(updated);
  },

  handleDragEnd: (event: any) => {
    const { active, over } = event;
    const { listProductsEdited, setListProductsEdited } =
      useVinculationProductsLive.getState();
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = listProductsEdited.findIndex(
        (item) => item._id === active.id
      );
      const newIndex = listProductsEdited.findIndex(
        (item) => item._id === over.id
      );

      const reordered = arrayMove(listProductsEdited, oldIndex, newIndex);

      console.log("muve array", reordered);

      setListProductsEdited(reordered);
    }
  },
}));
