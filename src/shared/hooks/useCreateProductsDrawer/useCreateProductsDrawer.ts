import { create } from "zustand";
import { CreateProductFormProps, handleCreateProductsProps } from "./types";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { toast } from "sonner";
import { ref, set as setdb } from "firebase/database";
import { db } from "@/lib/firebase";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

import axios from "axios";

export const useCreateProductsDrawer = create<CreateProductFormProps>(
  (set) => ({
    loadingCreateProducts: false,
    setLoadingCreateProducts: (loading) =>
      set({ loadingCreateProducts: loading }),

    openModalCreateProducts: false,
    setOpenModalCreateProducts: (openModalCreateProducts) =>
      set({ openModalCreateProducts }),

    searchProductsIsLoading: false,
    setSearchProductsIsLoading: (loading) =>
      set({ searchProductsIsLoading: loading }),

    productObject: null,
    setProductObject: (productObject) => set({ productObject }),

    productId: null,
    setProductId: (productId) => set({ productId }),

    getIdByLink: (link) => {
      const { setProductId } = useCreateProductsDrawer.getState();
      const match = link.match(/product_id=(\d+)/);
      const productId = match ? match[1] : null;
      setProductId(productId);
      return productId;
    },

    highlightedProductList: [],
    setHighlightedProductList: (highlightedProductList) =>
      set({ highlightedProductList }),

    handleGetProductById: async (id) => {
      const token = GetTokenUser();
      const { setProductObject, setSearchProductsIsLoading } =
        useCreateProductsDrawer.getState();
      try {
        setSearchProductsIsLoading(true);
        const res = await axios.post(
          "https://livemanager.buscabusca.com.br/service/apirest",
          {
            method: "ProductServiceRest",
            action: "List",
            direct: true,
            product_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"41e2063d9f74a60ae06b0ba0c9b569420f3e05574643546a42da7654310be46a1db97f8b565da4489a7d140e0d3b5ec52974bd7b43fb8a73de172f42b273d0958a3dac720a530ec63001e4b8979978e5ab2d605df6d53332d22015fa55b816cd716cda703d6ee6e017afcfd33b9ec1d8b06a2d0beead4915d43825e7f049141f79cdd2a21258e11235661ec30e026c2e7feec73e5b122ca3b4632ccb297c3b232c7ae97dd55bfed3a2b53bb9b350d49a0f468170e8976bd659ea55886a4a53271a7b89c8ce7103ad90b054a1ed08b1783498384888927f2ca7513bf888b3b1d0006ffaa6cb642e1266c6156c3fec312abf302823a3f997eda9c43cf43f119912"}`,
            },
            withCredentials: true,
          }
        );

        console.log("Product fetched:", res.data[0]);
        setProductObject({
          ...res.data[0],
          id: res.data[0].product_id,
          imageMain: res.data[0].image,
          imagesSecondary: res.data[0].images || [],
          description: res.data[0].details_description || "",
          stock: res.data[0].quantity || "",
        });
      } catch (error: any) {
        toast.error("Erro ao buscar produto", {
          description: `${error.response.data.message}`,
        });
      } finally {
        setSearchProductsIsLoading(false);
      }
    },

    handleCreateProducts: async ({
      liveId,
      newProduct,
      isProductLive,
    }: handleCreateProductsProps) => {
      const {
        setLoadingCreateProducts,
        highlightedProductList,
        setHighlightedProductList,
        setOpenModalCreateProducts,
        setProductObject,
      } = useCreateProductsDrawer.getState();
      const { user } = useLogin.getState();
      const { handleAddVinculationProduct } =
        useVinculationProductsLive.getState();

      try {
        setLoadingCreateProducts(true);

        if (isProductLive) {
          const data = {
            id: newProduct.id ?? "",
            name: newProduct.name,
            link: newProduct.link,
            hourStart: newProduct.hourStart ?? "",
            hourEnd: newProduct.hourEnd ?? "",
            price: newProduct.price,
            imageMain: newProduct.imageMain,
            imagesSecondary: newProduct.imagesSecondary ?? [],
            VinculateId: liveId,
            liveId: liveId,
            userId: user?._id ?? "",
          };

          await handleAddVinculationProduct(data);

          return;
        }

        const productsRef = ref(db, `products/${liveId}`);
        const newList = [
          ...highlightedProductList,
          {
            name: newProduct.name,
            link: newProduct.link,
            imageMain: newProduct.imageMain,
            imagesSecondary: newProduct.imagesSecondary,
            price: newProduct.price,
            description: newProduct.description,
            stock: newProduct.stock,
            id: newProduct.id,
          },
        ];

        console.log("produtos", newList);
        setHighlightedProductList(newList);
        await setdb(productsRef, {
          products: newList,
        });
        setProductObject(null);
        setOpenModalCreateProducts(false);
        toast.success("Produto adicionado com sucesso!", {
          description: `O produto ${newProduct.name} foi adicionado com sucesso!`,
          duration: 3000,
        });
      } catch (error: any) {
        console.log("error ao vincular produto", error);
        let message = "Erro desconhecido";
        if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }
        console.error("error ao vincular produto", message);
        toast.error("Erro ao vincular produto", {
          description: message,
        });
      } finally {
        setLoadingCreateProducts(false);
        setOpenModalCreateProducts(false);
      }

      return Promise.resolve();
    },

    loadingDeleteProduct: false,
    setLoadingDeleteProduct: (loadingDeleteProduct) =>
      set({ loadingDeleteProduct }),

    openModalConfirmDeleteProductInLive: false,
    setOpenModalConfirmDeleteProductInLive: (
      openModalConfirmDeleteProductInLive
    ) => set({ openModalConfirmDeleteProductInLive }),

    productObjForDeleteOrEdit: null,
    setProductObjForDeleteOrEdit: (productObjForDeleteOrEdit) =>
      set({ productObjForDeleteOrEdit }),

    handleDeleteProduct: async ({ productId, liveId }) => {
      const {
        setLoadingDeleteProduct,
        highlightedProductList,
        setHighlightedProductList,
        setOpenModalConfirmDeleteProductInLive,
      } = useCreateProductsDrawer.getState();

      const productRef = ref(db, `products/${liveId}`);
      try {
        setLoadingDeleteProduct(true);
        const objectDeleted = highlightedProductList.find(
          (item) => item.id === productId
        );
        const newList = highlightedProductList.filter(
          (item) => item.id !== productId
        );
        setHighlightedProductList(newList);

        await setdb(productRef, {
          products: newList,
        });
        setOpenModalConfirmDeleteProductInLive(false);
        toast.success("Produto removido com sucesso!", {
          description: `O produto ${objectDeleted?.name} foi removido com sucesso!`,
        });
      } catch (error: any) {
      } finally {
        setLoadingDeleteProduct(false);
      }
    },
  })
);
