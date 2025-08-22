import { create } from "zustand";
import { CreateProductFormProps, handleCreateProductsProps } from "./types";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { toast } from "sonner";
import { ref, set as setdb } from "firebase/database";
import { db } from "@/lib/firebase";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { api } from "@/lib/axios";
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

    getIdByLink: async (link) => {
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
          `https://livemanager.buscabusca.com.br/service/apirest`,
          {
            method: "ProductServiceRest",
            action: "List",
            direct: true,
            product_id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${"11dcf3e778f4a16f4c9653d136cacf4062a6608cb642f1ab8f8d0d3a876c3430bb2396e947c6b7346392603d9348c18b6b9971ab77d7ebbc0789649aba50a42ba7348a641e6fb7ca3bd59b2ba88dca318258559e576bf0d66ade5c36cd3c423e1f0dad3dca1671ad0192165ee4ee50ae6addc28e439ec95ba16be08f2d1df095d71a0b816690cfec0b3bf8bdd890e4787c7f426cd57d5d86a30ef407ba01321cef512b9d2782e6f9f4a461d9cadc94047e26db5ee24fb0d9e795f90a0009be39971d59900cb6bbf56fa6b1f1199ffff04c170c6a2cacd5e649a52ebc1b6bfe47ba70229a5c903ebd48e3689a6864ec2eea327c74786057e5d161ce86475ec9d1"}`,
            },
          }
        );

        console.log("Product fetched:", res.data);
        setProductObject(res.data);
      } catch (error: any) {
        toast.error("Erro ao buscar produto", {
          description: `${error.response.data.error}`,
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

      console.log("New Product:", liveId);
      try {
        setLoadingCreateProducts(true);

        if (isProductLive) {
          const data = {
            _id: newProduct._id ?? "",
            name: newProduct.name,
            link: newProduct.link,
            hourStart: newProduct.hourStart ?? "",
            hourEnd: newProduct.hourEnd ?? "",
            price: newProduct.price,
            imageMain: newProduct.imageMain,
            imagesSecondary: newProduct.imagesSecondary,
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
