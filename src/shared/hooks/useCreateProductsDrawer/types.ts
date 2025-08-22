import { CreateProductFormSchemaData } from "./createProductsSchema";

export type productObject = {
  id: string;
  name: string;
  link: string;
  imageMain: string;
  imagesSecondary: [
    {
      image: string;
    }
  ];
  price: string;
  description: string;
  stock: string;
  hourStart?: string;
  hourEnd?: string;
};

export type handleCreateProductsProps = {
  liveId: string;
  newProduct: productObject;
  isProductLive: boolean;
};

export type handleDeleteProductProps = {
  productId: string;
  liveId: string;
};

export interface CreateProductFormProps {
  loadingCreateProducts: boolean;
  setLoadingCreateProducts: (loading: boolean) => void;
  searchProductsIsLoading: boolean;
  setSearchProductsIsLoading: (loading: boolean) => void;

  openModalCreateProducts: boolean;
  setOpenModalCreateProducts: (openModalCreateProducts: boolean) => void;
  handleCreateProducts: ({
    liveId,
    newProduct,
    isProductLive,
  }: handleCreateProductsProps) => Promise<void>;

  loadingDeleteProduct: boolean;
  setLoadingDeleteProduct: (loading: boolean) => void;
  handleDeleteProduct: ({
    productId,
    liveId,
  }: handleDeleteProductProps) => Promise<void>;

  highlightedProductList: productObject[];
  setHighlightedProductList: (highlightedProductList: productObject[]) => void;
  handleGetProductById: (id: string) => Promise<void>;

  openModalConfirmDeleteProductInLive: boolean;
  setOpenModalConfirmDeleteProductInLive: (
    openModalConfirmDeleteProductInLive: boolean
  ) => void;

  productObjForDeleteOrEdit: productObject | null;
  setProductObjForDeleteOrEdit: (
    productObjForDeleteOrEdit: productObject | null
  ) => void;

  productObject: productObject | null;
  setProductObject: (productObject: productObject | null) => void;

  productId: string | null;
  setProductId: (productId: string | null) => void;
  getIdByLink: (link: string) => string | null;
}
