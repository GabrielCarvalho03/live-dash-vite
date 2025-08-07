"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Filter,
  Pencil,
  Play,
  Trash,
  ChevronDown,
  Loader2,
  Blocks,
  Link,
} from "lucide-react";
import { useEffect } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import dayjs from "dayjs";
import { useLive } from "../../hooks/useLive";
import { StatusLive } from "../statusLive/statusLive";
import { CategorieLive } from "../categorieLive/categorieLive";
import { ProductVinculationModal } from "../createLiveSteps/products/form";
import { CreateLiveStepsModal } from "../createLiveSteps/createLiveSteps";
import { useVinculationProductsLive } from "../../hooks/useVinculationProducts";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";
import { liveObject } from "../../hooks/types";
import { toast } from "sonner";

const livesMock = [
  {
    id: 1,
    title: "Introdução ao Streaming",
    description: "Aprenda os conceitos básicos...",
    status: "Finalizada",
    category: "educacional",
    datetime: "15/01/2024 19:00",
    views: 1250,
    streamKey: "",
    rtmpUrl: "",
  },
  {
    id: 2,
    title: "Gaming Live - Campeonato",
    description: "Transmissão ao vivo do campeonato...",
    status: "AO VIVO",
    category: "gaming",
    datetime: "20/01/2024 20:00",
    views: 3420,
    streamKey: "abc123xyz",
    rtmpUrl: "rtmp://livepeer.com/live",
  },
  {
    id: 3,
    title: "Tutorial OBS Studio",
    description: "Como configurar o OBS Studio...",
    status: "Agendada",
    category: "tutorial",
    datetime: "25/01/2024 14:00",
    views: 0,
    streamKey: "streamkey456",
    rtmpUrl: "rtmp://livepeer.com/live",
  },
];

export default function LiveContent() {
  const {
    modalCreateLiveIsOpen,
    liveList,
    liveEdit,
    setLiveEdit,
    setModalCreateLiveIsOpen,
    handleOpenCreateLiveModal,
    handleGetLive,
  } = useLive();
  const { allVinculationProducts, handleGetAllVinculationProduct } =
    useVinculationProductsLive();

  const resumo = {
    aoVivo: livesMock.filter((l) => l.status === "live").length,
    agendadas: livesMock.filter((l) => l.status === "scheduled").length,
    totalViews: livesMock.reduce((acc, l) => acc + l.views, 0),
  };

  const { user, loginisLoading, setUser, handleGetUserById } = useLogin();
  const {
    openVinculationProductModal,
    openDeleteLiveModal,
    liveEditObject,
    loadingDeleteLive,
    loadingLiveList,
    setLoadingLiveList,
    setOpenDeleteLiveModal,
    setLiveEditObject,
    setOpenVinculationProductModal,
    handleDeleteLive,
  } = useLive();

  useEffect(() => {
    if (!user?._id) {
      GetDataForPage();
    }
    if (!liveList.length) {
      handleGetLive();
      handleGetAllVinculationProduct();
    }
  }, []);

  const GetDataForPage = async () => {
    const user = await handleGetUserById();
    setUser(user);

    await handleGetLive();
    await handleGetAllVinculationProduct();
  };

  const verifyLiveForEdit = (data: liveObject) => {
    if (data.status === "live") {
      toast.error("Não é possivel editar", {
        description: "Não é posssivel editar live que está no ar.",
      });

      return;
    }

    setModalCreateLiveIsOpen(true);
    setLiveEditObject(data);
    setLiveEdit(true);
  };

  // if (getAllUserIsLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <Input placeholder="Buscar lives..." className="flex-grow max-w-xs" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Todos <ChevronDown className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Todas <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full">
        <div className="hidden md:grid md:grid-cols-6 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 border-b">
          <span className="text-left">Live</span>
          <span className="text-left">Status</span>
          <span className="text-left">Categoria</span>
          <span className="text-left">Data/Hora</span>
          <span className="text-left">produtos vinculados</span>
          <span className="text-left">Ações</span>
        </div>

        {loadingLiveList ? (
          <div className="flex justify-center items-center mt-40">
            <Loader2 className="w-12 h-12  text-blue-500 animate-spin " />
          </div>
        ) : (
          liveList?.map((live, index) => {
            const productOfLive = allVinculationProducts.find(
              (item) => item.liveId === live._id
            );
            const productsVinculateTotalLive = allVinculationProducts.filter(
              (item) => item.liveId === live._id
            );

            console.log("producstVinculado", productOfLive);

            return (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-6 px-4 md:px-6 py-4 text-sm text-gray-700 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col mb-2 md:mb-0">
                  <span className="font-medium text-gray-900">
                    {live.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {live.description}
                  </span>

                  {(live.status === "live" || live.status === "scheduled") && (
                    <div className="mt-2 text-xs bg-yellow-100 text-yellow-900 p-2 border border-yellow-400 rounded-md w-fit max-w-full leading-tight">
                      <p>
                        <strong>🔑 OBS:</strong> {live.streamKey ?? ""}
                      </p>
                      <p>
                        <strong>📡 RTMP:</strong> {live.url_RTMP}
                      </p>
                      <p className="text-[10px] text-yellow-800 italic mt-1">
                        *Copie no OBS para transmitir*
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-2 md:mb-0">
                  <StatusLive status={live.status} />
                </div>

                <div className="mb-2 md:mb-0">
                  <CategorieLive categorie={live?.category} />
                </div>

                <div className="mb-2 md:mb-0">
                  <section className="flex flex-col gap-2">
                    <span>
                      {dayjs(live.dayLive?.date).format("DD/MM/YYYY") +
                        " " +
                        "às" +
                        " " +
                        live.dayLive?.hour}
                    </span>
                    <span>{live.dayLive?.day}</span>
                  </section>
                </div>

                <div className="mb-2 md:mb-0 w-full flex items-center  ">
                  <span className="">
                    {productsVinculateTotalLive?.length
                      ? productsVinculateTotalLive?.length
                      : "nenhum produto vinculado"}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => verifyLiveForEdit(live)}
                    size="icon"
                    variant="ghost"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    className={`${productOfLive ? "pointer-events-none" : ""}`}
                    onClick={
                      productOfLive
                        ? () => {}
                        : () => {
                            setLiveEditObject(live);
                            setOpenVinculationProductModal(true);
                          }
                    }
                    size="icon"
                    variant="ghost"
                  >
                    {productOfLive ? <Link /> : <Blocks className="w-4 h-4" />}
                  </Button>
                  {live.status === "live" ? (
                    <Button size="icon" variant="ghost">
                      <Play className="w-4 h-4 text-blue-600" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setLiveEditObject(live);
                        setOpenDeleteLiveModal(true);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <ProductVinculationModal
        isOpen={openVinculationProductModal}
        onClose={() => setOpenVinculationProductModal(false)}
      />
      <CreateLiveStepsModal
        isOpen={modalCreateLiveIsOpen}
        onClose={() => {
          setModalCreateLiveIsOpen(false);
          liveEdit ? setLiveEdit(false) : null;
          setLiveEditObject({} as liveObject);
        }}
      />

      <DeleteConfirmModal
        title="Tem certeza que deseja apagar essa Live?"
        description="Os produtos criados nessa live também serão excluidos."
        isOpen={openDeleteLiveModal}
        loading={loadingDeleteLive}
        onClose={() => {
          setOpenDeleteLiveModal(false);
          setLiveEditObject({} as liveObject);
        }}
        onDelete={() => handleDeleteLive(liveEditObject)}
      />
    </div>
  );
}
