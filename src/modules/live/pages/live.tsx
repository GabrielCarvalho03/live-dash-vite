"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Plus,
  Tv,
  CalendarClock,
  Eye,
  Filter,
  Pencil,
  Play,
  Trash,
  ChevronDown,
  Loader2,
  Blocks,
  Video,
  Package,
} from "lucide-react";
import { CreateLiveStepsModal } from "../components/createLiveSteps/createLiveSteps";
import { useLive } from "../hooks/useLive";
import { useEffect } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import dayjs from "dayjs";
import { Loader } from "@/shared/components/loader/loader";
import { StatusLive } from "../components/statusLive/statusLive";
import { CategorieLive } from "../components/categorieLive/categorieLive";
import { ProductVinculationModal } from "../components/createLiveSteps/products/form";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import LiveContent from "../components/liveContent/liveContent";
import ProductsContent from "../components/productsContent/productsContent";

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

export default function Lives() {
  const {
    modalCreateLiveIsOpen,
    liveList,
    setModalCreateLiveIsOpen,
    handleOpenCreateLiveModal,
    handleGetLive,
  } = useLive();

  const resumo = {
    aoVivo: livesMock.filter((l) => l.status === "live").length,
    agendadas: livesMock.filter((l) => l.status === "scheduled").length,
    totalViews: livesMock.reduce((acc, l) => acc + l.views, 0),
  };

  const { user, loginisLoading, setUser, handleGetUserById } = useLogin();
  const {
    openVinculationProductModal,
    setLiveEditObject,
    setOpenVinculationProductModal,
  } = useLive();

  useEffect(() => {
    if (!user?._id) {
      GetDataForPage();
    }
    if (!liveList) {
      handleGetLive();
    }
  }, []);

  const GetDataForPage = async () => {
    const user = await handleGetUserById();
    setUser(user);

    await handleGetLive();
  };

  // if (getAllUserIsLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Gerenciar Lives</h2>
          <p className="text-muted-foreground text-sm">
            Crie, agende e gerencie suas transmissões ao vivo
          </p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => handleOpenCreateLiveModal()}
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Live
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-red-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Ao Vivo</p>
                <p className="text-2xl font-bold">{resumo.aoVivo}</p>
              </div>
              <Tv className="text-red-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Agendadas</p>
                <p className="text-2xl font-bold">{resumo.agendadas}</p>
              </div>
              <CalendarClock className="text-blue-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Visualizações</p>
                <p className="text-2xl font-bold">
                  {resumo.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="text-green-600 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lives" className="w-full  ">
        <TabsList className="grid w-full grid-cols-2   ">
          <TabsTrigger value="lives" className="flex items-center gap-2  ">
            <Video className="w-4 h-4" />
            Lives
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Produtos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lives" className="space-y-4">
          <LiveContent />
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <ProductsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
