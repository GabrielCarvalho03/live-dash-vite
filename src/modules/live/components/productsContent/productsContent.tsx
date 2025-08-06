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

export default function ProductsContent() {
  const {
    modalCreateLiveIsOpen,
    liveList,
    setModalCreateLiveIsOpen,
    handleOpenCreateLiveModal,
    handleGetLive,
    openVinculationProductModal,
    setLiveEditObject,
    setOpenVinculationProductModal,
  } = useLive();

  const resumo = {
    aoVivo: livesMock.filter((l) => l.status === "live").length,
    agendadas: livesMock.filter((l) => l.status === "scheduled").length,
    totalViews: livesMock.reduce((acc, l) => acc + l.views, 0),
  };

  const { user, setUser, handleGetUserById } = useLogin();

  const {
    loadingisGetAllVinculationProduct,
    allVinculationProducts,
    vinculationProductsObject,
    openDeleteVinculationProductModal,
    loadingDeleteVinculationProducts,
    setOpenDeleteVinculationProductModal,
    setVinculationProductsObject,
    handleGetAllVinculationProduct,
    handleDeleteVinculationProduct,
  } = useVinculationProductsLive();

  useEffect(() => {
    if (!user?._id) {
      GetDataForPage();
    }
    if (!allVinculationProducts.length) {
      handleGetAllVinculationProduct();
    }
  }, []);

  const GetDataForPage = async () => {
    const user = await handleGetUserById();
    setUser(user);

    await handleGetAllVinculationProduct();
  };

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
          <span className="text-left">Produto</span>
          <span className="text-left">Status</span>
          <span className="text-left">Categoria</span>
          <span className="text-left">inicio</span>
          <span className="text-left">Live vinculada</span>

          <span className="text-left">Ações</span>
        </div>

        {loadingisGetAllVinculationProduct ? (
          <div className="flex justify-center items-center mt-40">
            <Loader2 className="w-12 h-12  text-blue-500 animate-spin " />
          </div>
        ) : (
          allVinculationProducts?.map((products, index) => {
            const liveOfProductVinculation = liveList.find(
              (item) => item._id === products.liveId
            );

            return (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-6 px-4 md:px-6 py-4 text-sm text-gray-700 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col mb-2 md:mb-0">
                  <span className="font-medium text-gray-900">
                    {products.name}
                  </span>
                </div>

                <div className="mb-2 md:mb-0">
                  <span className="text-xs text-gray-500">
                    <StatusLive status={"Ativo"} />
                  </span>
                </div>

                <div className="mb-2 md:mb-0">
                  <span className="text-xs text-gray-500">
                    <CategorieLive
                      categorie={liveOfProductVinculation?.category ?? ""}
                    />
                  </span>
                </div>

                <div className="mb-2 md:mb-0">
                  <span className="text-xs font-medium text-gray-900">
                    {products.hourStart}
                  </span>
                </div>

                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-white bg-purple-300 px-2 py-1 rounded-full ">
                    {liveOfProductVinculation?.title}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Button size="icon" variant="ghost">
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setVinculationProductsObject(products);
                      setOpenDeleteVinculationProductModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
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
        onClose={() => setModalCreateLiveIsOpen(false)}
      />

      <DeleteConfirmModal
        title="Tem certeza que deseja apagar esse produto?"
        loading={loadingDeleteVinculationProducts}
        isOpen={openDeleteVinculationProductModal}
        onClose={() => setOpenDeleteVinculationProductModal(false)}
        onDelete={() =>
          handleDeleteVinculationProduct(vinculationProductsObject)
        }
      />
    </div>
  );
}
