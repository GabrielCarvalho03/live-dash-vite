import { create } from "zustand";
import { liveObject, LiveRegisterType } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { boolean, date, promise } from "zod";
import { LiveApi } from "@/lib/api/liveApi";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { defaultHour } from "../utils/defualtHour";
import { useVinculationProductsLive } from "./useVinculationProducts";
export const useLive = create<LiveRegisterType>((set) => ({
  modalCreateLiveIsOpen: false,
  setModalCreateLiveIsOpen: (value) => set({ modalCreateLiveIsOpen: value }),

  handleOpenCreateLiveModal: () => {
    console.log("Abrindo modal");
    const { setModalCreateLiveIsOpen } = useLive.getState();
    setModalCreateLiveIsOpen(true);
  },

  totalLiveSchedule: 0,
  setTotalLiveSchedule: (value) => set({ totalLiveSchedule: value }),

  actualSaveSchedule: 0,
  setActualSaveSchedule: (value) => set({ actualSaveSchedule: value }),

  liveList: [],
  setLiveList: (value) => set({ liveList: value }),

  liveEditObject: {} as liveObject,
  setLiveEditObject: (value) => set({ liveEditObject: value }),

  openVinculationProductModal: false,
  setOpenVinculationProductModal: (value) =>
    set({ openVinculationProductModal: value }),

  openDeleteLiveModal: false,
  setOpenDeleteLiveModal: (openDeleteLiveModal: boolean) =>
    set({ openDeleteLiveModal }),

  loadingDeleteLive: false,
  setLoadingDeleteLive: (loadingDeleteLive: boolean) =>
    set({ loadingDeleteLive }),

  handleDeleteLive: async (data) => {
    const { user } = useLogin.getState();
    const {
      liveList,
      setLiveList,
      setOpenDeleteLiveModal,
      setLoadingDeleteLive,
    } = useLive.getState();
    const { allVinculationProducts, setAllViculationProducts } =
      useVinculationProductsLive.getState();

    try {
      setLoadingDeleteLive(true);

      await LiveApi.delete(`live/${data._id}`, {
        data: {
          role: user?.userType,
        },
      });

      const existeProductID = allVinculationProducts.filter(
        (item) => item.liveId === data._id
      );

      if (existeProductID) {
        const { allVinculationProducts, setAllViculationProducts } =
          useVinculationProductsLive.getState();
        for (let item of existeProductID) {
          await LiveApi.post("/live/product/delete", {
            userId: user?._id,
            productId: item._id,
          });
        }
        const idsToRemove = new Set(existeProductID.map((item) => item._id));
        const newListVinculationProducts = allVinculationProducts.filter(
          (product) => !idsToRemove.has(product._id)
        );

        setAllViculationProducts(newListVinculationProducts);
      }
      const newList = liveList.filter((item) => item._id !== data._id);

      setLiveList(newList);
      setOpenDeleteLiveModal(false);

      toast.success("Deletado com sucesso", {
        description: `Live ${data.title} foi deletada com sucesso.`,
      });
    } catch (error: any) {
      toast.error("Erro ao deletar live", {
        description: `${error.response.data.error}`,
      });
    } finally {
      setLoadingDeleteLive(false);
    }
  },

  loadingLiveList: false,
  setLoadingLiveList: (loadingLiveList: boolean) => set({ loadingLiveList }),
  handleGetLive: async () => {
    const { setLiveList, setLoadingLiveList } = useLive.getState();

    try {
      setLoadingLiveList(true);
      const lives = await LiveApi.get("/lives");

      console.log("lives", lives.data);

      setLiveList(lives.data.data);

      return lives.data.data;
    } catch (error: any) {
      toast.error("Erro ao buscar live", {
        description: `${error.response.data.error}`,
      });
    } finally {
      setLoadingLiveList(false);
    }

    return;
  },
  handleCreateLive: async (data) => {
    try {
      const { user } = useLogin.getState();
      const {
        liveList,
        setLiveList,
        setActualSaveSchedule,
        setTotalLiveSchedule,
      } = useLive.getState();

      const LiveIsSchedule = data.status === "scheduled";
      const token = GetTokenUser();

      if (LiveIsSchedule) {
        const listDaysLive = data.allSchedules;
        setTotalLiveSchedule(data.allSchedules.length);

        for (const item of listDaysLive) {
          const { actualSaveSchedule, liveList, setLiveList } =
            useLive.getState();
          setActualSaveSchedule(actualSaveSchedule + 1);

          toast.loading("Criando live", {
            id: "loadingLive",
            description: `${actualSaveSchedule + 1} de ${listDaysLive.length}`,
          });

          try {
            const response = await LiveApi.post(
              "/live/create",
              {
                user: {
                  userType: user?.userType,
                },
                data: {
                  image: data.image,
                  title: data.title,
                  category: data.category,
                  description: data.description ?? "",
                  url_transmission: "rtmp://servidor-obs/lives/interativa",
                  dayLive: {
                    date: item.date,
                    day: item.day,
                    hour: item.hour,
                  },
                  userName: user?.name ?? "",
                  url_play:
                    "http://meuservidor.tv:8080/live/interativa/index.m3u8",
                  status: data.status,
                  userId: user?._id,
                  likes: 0,
                  liked_by: [],
                },
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );

            await LiveApi.post("/live/livepeer-create", {
              name: response?.data?.live.title,
              userId: user?._id,
              liveId: response.data.live._id,
            });

            setLiveList([...liveList, response.data.live]);
          } catch (error: any) {
            console.log("erro", error);
            toast.dismiss("loadingLive");
            toast.error("Erro ao criar live", {
              description: `${error.response.data.error}`,
            });
          }
        }
        toast.dismiss("loadingLive");
        toast.success("Live criada com sucesso");

        setActualSaveSchedule(0);
        setTotalLiveSchedule(0);

        return;
      }

      const dayName = format(new Date(), "EEEE", {
        locale: ptBR,
      });
      setTotalLiveSchedule(1);

      toast.loading("Criando live", {
        id: "loadingLive",
        description: `${1} de ${1}`,
      });
      const response = await LiveApi.post("/live/create", {
        user: {
          userType: user?.userType,
        },
        data: {
          image: data.image,
          title: data.title,
          category: data.category,
          description: data.description ?? "",
          url_transmission: "rtmp://servidor-obs/lives/interativa",
          dayLive: {
            date: new Date().toISOString(),
            day: dayName,
            hour: defaultHour(),
          },
          url_play: "http://meuservidor.tv:8080/live/interativa/index.m3u8",
          status: data.status,
          userName: user?.name ?? "",
          userId: user?._id,
          likes: 0,
          liked_by: [],
        },
        headers: {
          Authorization: token,
        },
      });

      await LiveApi.post("/live/livepeer-create", {
        name: response?.data?.live.title,
        userId: user?._id,
        liveId: response.data.live._id,
      });

      toast.dismiss("loadingLive");
      toast.success("Live criada com sucesso");

      setActualSaveSchedule(0);
      setTotalLiveSchedule(0);

      setLiveList([...liveList, response.data.live]);
    } catch (error: any) {
      toast.dismiss("loadingLive");
      toast.error("Erro ao criar live", {
        description: `${error.response.data.error}`,
      });
    }
  },
}));
