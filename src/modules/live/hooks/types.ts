import { LiveCreateSchemaData } from "./liveCreateSchema";
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
  rtmpUrl: string;
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

  liveList: liveObject[];
  setLiveList: (value: liveObject[]) => void;
  handleGetLive: () => Promise<liveObject[] | undefined>;
  handleCreateLive: (data: LiveCreateSchemaData) => Promise<void>;
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
}
