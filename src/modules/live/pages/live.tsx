"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Plus, Tv, CalendarClock, Eye, Video, Package } from "lucide-react";
import { useLive } from "../hooks/useLive";
import { useEffect, useState } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import LiveContent from "../components/liveContent/liveContent";
import ProductsContent from "../components/productsContent/productsContent";
import { GetLiveForUserOrAdmin } from "@/shared/utils/getLiveForUserOrAdmin";

export default function Lives() {
  const [hasLoadedLives, setHasLoadedLives] = useState(false);
  const { user, setUser, handleGetUserById, setLoginisLoading } = useLogin();
  const { liveList, handleOpenCreateLiveModal } = useLive();

  const resumo = {
    aoVivo: liveList?.filter((l) => l.status === "live").length,
    agendadas: liveList?.filter((l) => l.status === "scheduled").length,
    totalViews: 0,
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!user?._id && !hasLoadedLives) {
        setLoginisLoading(true);
        const userData = await handleGetUserById();

        if (userData?._id) {
          setUser(userData);
          setHasLoadedLives(true); // Marca como carregado
          await GetLiveForUserOrAdmin(userData);
        }
      }
    };

    initializeData();
  }, []);
  useEffect(() => {
    if (user?._id && liveList.length === 0 && !hasLoadedLives) {
      setHasLoadedLives(true); // Marca como carregado
      GetLiveForUserOrAdmin(user);
    }
  }, [user?._id]);

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Gerenciar Lives</h2>
          <p className="text-muted-foreground text-sm">
            Crie, agende e gerencie suas transmissões ao vivo
          </p>
        </div>

        <div className="flex gap-5">
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => handleOpenCreateLiveModal()}
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Live
          </Button>
        </div>
      </section>

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
