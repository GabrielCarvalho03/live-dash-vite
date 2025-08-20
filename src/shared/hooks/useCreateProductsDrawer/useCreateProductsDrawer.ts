import { create } from "zustand";
import { CreateProductFormProps, handleCreateProductsProps } from "./types";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { toast } from "sonner";
import { ref, set as setdb } from "firebase/database";
import { db } from "@/lib/firebase";

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

    getIdByLink: async (link) => {
      const match = link.match(/product_id=(\d+)/);
      const productId = match ? match[1] : null;
      return productId;
    },

    highlightedProductList: [],
    setHighlightedProductList: (highlightedProductList) =>
      set({ highlightedProductList }),

    handleGetProductById: async (id) => {
      const token = GetTokenUser();
      const { setProductObject } = useCreateProductsDrawer.getState();
      try {
        setProductObject({
          _id: "9489",
          description: "Descrição do produto...",
          imageMain:
            "https://sampa.buscabusca.com.br/image/cache/catalog/seller_upload_id351/CAMERA%20IP%20WIFI%20INTELIGENTE%208177%20(11)-350x350.jpg",
          imagesSecondary: [
            "https://sampa.buscabusca.com.br/image/cache/catalog/seller_upload_id351/CAMERA%20IP%20WIFI%20INTELIGENTE%208177%20(4)-500x500.jpg",
            "https://sampa.buscabusca.com.br/image/cache/catalog/seller_upload_id351/CAMERA%20IP%20WIFI%20INTELIGENTE%208177%20(5)-74x74.jpg",
            "https://sampa.buscabusca.com.br/image/cache/catalog/seller_upload_id351/CAMERA%20IP%20WIFI%20INTELIGENTE%208177%20(7)-500x500.jpg",
          ],
          link: "https://sampa.buscabusca.com.br/index.php?route=product/product&product_id=9565",
          name: "CAMERA IP WIFI INTELIGENTE 8177",
          price: "R$ 500,00",
          stock: "10",
        });
      } catch (error: any) {
        toast.error("Erro ao buscar produto", {
          description: `${error.response.data.error}`,
        });
      }
    },

    handleCreateProducts: async ({
      liveId,
      newProduct,
    }: handleCreateProductsProps) => {
      const {
        setLoadingCreateProducts,
        highlightedProductList,
        setHighlightedProductList,
        setOpenModalCreateProducts,
        setProductObject,
      } = useCreateProductsDrawer.getState();

      try {
        setLoadingCreateProducts(true);
        const productsRef = ref(db, `products/${liveId}`);
        // Adiciona o novo produto ao final da lista
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
            _id: newProduct._id,
          },
        ];
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
        toast.error("Erro ao vincular produto", {
          description: `${error.response.data.error}`,
        });
      } finally {
        setLoadingCreateProducts(false);
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
          (item) => item._id === productId
        );
        const newList = highlightedProductList.filter(
          (item) => item._id !== productId
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
