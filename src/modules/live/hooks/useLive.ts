import { create } from "zustand";
import { liveObject, LiveRegisterType } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { date, promise } from "zod";
import { LiveApi } from "@/lib/api/liveApi";
import { GetTokenUser } from "@/shared/utils/getTokenUser";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { defaultHour } from "../utils/defualtHour";
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

  handleGetLive: async () => {
    const { setLiveList } = useLive.getState();

    try {
      const lives = await LiveApi.get("/lives");

      console.log("lives", lives.data);

      setLiveList(lives.data.data);

      return lives.data.data;
    } catch (error: any) {
      toast.error("Erro ao buscar live", {
        description: `${error.response.data.error}`,
      });
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

          await new Promise((resolve) => setTimeout(resolve, 2000));
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
          userId: user?._id,
          likes: 0,
          liked_by: [],
        },
        headers: {
          Authorization: token,
        },
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
