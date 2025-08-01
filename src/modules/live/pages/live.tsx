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
} from "lucide-react";
import { CreateLiveStepsModal } from "../components/createLiveSteps/live/createLiveSteps";
import { useLive } from "../hooks/useLive";

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
    setModalCreateLiveIsOpen,
    handleOpenCreateLiveModal,
  } = useLive();

  const resumo = {
    aoVivo: livesMock.filter((l) => l.status === "AO VIVO").length,
    agendadas: livesMock.filter((l) => l.status === "Agendada").length,
    totalViews: livesMock.reduce((acc, l) => acc + l.views, 0),
  };

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
          <Plus className="w-4 h-4 mr-2" /> Nova Lives
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
          <span className="text-left">Visualizações</span>
          <span className="text-left">Ações</span>
        </div>

        {livesMock.map((live, index) => (
          <div
            key={index}
            className="flex flex-col md:grid md:grid-cols-6 px-4 md:px-6 py-4 text-sm text-gray-700 border-b hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col mb-2 md:mb-0">
              <span className="font-medium text-gray-900">{live.title}</span>
              <span className="text-xs text-gray-500">{live.description}</span>

              {(live.status === "AO VIVO" || live.status === "Agendada") && (
                <div className="mt-2 text-xs bg-yellow-100 text-yellow-900 p-2 border border-yellow-400 rounded-md w-fit max-w-full leading-tight">
                  <p>
                    <strong>🔑 OBS:</strong> {live.streamKey}
                  </p>
                  <p>
                    <strong>📡 RTMP:</strong> {live.rtmpUrl}
                  </p>
                  <p className="text-[10px] text-yellow-800 italic mt-1">
                    *Copie no OBS para transmitir*
                  </p>
                </div>
              )}
            </div>

            <div className="mb-2 md:mb-0">
              <Badge
                className={
                  live.status === "AO VIVO"
                    ? "bg-red-500 text-white"
                    : live.status === "Agendada"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }
              >
                {live.status}
              </Badge>
            </div>

            <div className="mb-2 md:mb-0">
              <span className="inline-block text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-300 text-gray-700">
                {live.category}
              </span>
            </div>

            <div className="mb-2 md:mb-0">
              <span>{live.datetime}</span>
            </div>

            <div className="mb-2 md:mb-0">
              <span>{live.views.toLocaleString()}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Button size="icon" variant="ghost">
                <Pencil className="w-4 h-4" />
              </Button>
              {live.status === "AO VIVO" ? (
                <Button size="icon" variant="ghost">
                  <Play className="w-4 h-4 text-blue-600" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost">
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateLiveStepsModal
        isOpen={modalCreateLiveIsOpen}
        onClose={() => setModalCreateLiveIsOpen(false)}
      />
    </div>
  );
}
