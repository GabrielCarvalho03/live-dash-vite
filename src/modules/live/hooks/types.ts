import { LiveCreateSchemaData } from "./liveCreateSchema";
import { LiveEditSchemaData } from "./liveEditSchema";
import { VinculationProductsLiveSchemaData } from "./vinculationProductsLiveSchema";

export type liveObject = {
  _id: string;
  title: string;
  category: string;
  description: string;
  url_transmission: string;
  url_play: string;
  image: string;
  status: string;
  dayLive: {
    date: string;
    day: string;
    hour: string;
  };
  userId: string;
  likes: number;
  liked_by: any[];
  streamKey: string;
  url_RTMP: string;
  views: string;
};

export type allVinculationProductsObj = {
  _id: string;
  name: string;
  link: string;
  hourStart: string;
  hourEnd: string;
  liveId: string;
  userId: string;
};

export interface LiveRegisterType {
  modalCreateLiveIsOpen: boolean;
  setModalCreateLiveIsOpen: (value: boolean) => void;
  handleOpenCreateLiveModal: () => void;

  totalLiveSchedule: number;
  setTotalLiveSchedule: (value: number) => void;
  actualSaveSchedule: number;
  setActualSaveSchedule: (value: number) => void;

  liveEditObject: liveObject;
  setLiveEditObject: (value: liveObject) => void;

  openVinculationProductModal: boolean;
  setOpenVinculationProductModal: (value: boolean) => void;

  openDeleteLiveModal: boolean;
  setOpenDeleteLiveModal: (value: boolean) => void;

  loadingDeleteLive: boolean;
  setLoadingDeleteLive: (value: boolean) => void;
  handleDeleteLive: (value: liveObject) => Promise<void>;

  liveEdit: boolean;
  setLiveEdit: (value: boolean) => void;

  liveList: liveObject[];
  setLiveList: (value: liveObject[]) => void;
  loadingLiveList: boolean;
  setLoadingLiveList: (value: boolean) => void;
  handleGetLive: () => Promise<liveObject[] | undefined>;
  handleCreateLive: (data: LiveCreateSchemaData) => Promise<void>;

  loadingUpdateLive: boolean;
  setLoadingUpdateLive: (value: boolean) => void;
  handleUpdateLive: (data: LiveCreateSchemaData) => Promise<void>;
}

export interface VinculationProduct {
  loadingVinculationProduct: boolean;
  setLoadingVinculationProduct: (value: boolean) => void;

  handleAddVinculationProduct: (
    data: VinculationProductsLiveSchemaData
  ) => Promise<void>;

  loadingisGetAllVinculationProduct: boolean;
  setLoadingisGetAllVinculationProduct: (value: boolean) => void;

  allVinculationProducts: allVinculationProductsObj[];
  setAllViculationProducts: (value: allVinculationProductsObj[]) => void;
  handleGetAllVinculationProduct: () => Promise<void>;

  vinculationProductsObject: allVinculationProductsObj;
  setVinculationProductsObject: (value: allVinculationProductsObj) => void;

  openDeleteVinculationProductModal: boolean;
  setOpenDeleteVinculationProductModal: (value: boolean) => void;

  listProductsEdited: allVinculationProductsObj[];
  setListProductsEdited: (value: allVinculationProductsObj[]) => void;

  loadingDeleteVinculationProducts: boolean;
  setLoadingDeleteVinculationProducts: (value: boolean) => void;
  handleDeleteVinculationProduct: (
    data: allVinculationProductsObj
  ) => Promise<void>;

  handleChange: (
    index: number,
    field: keyof allVinculationProductsObj,
    value: string
  ) => void;

  addProduct: () => void;
  removeProduct: (index: number) => void;
  handleDragEnd: (event: any) => void;
}
