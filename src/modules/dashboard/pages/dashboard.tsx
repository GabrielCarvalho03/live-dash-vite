"use client";

import { useEffect, useState } from "react";
import {
  Tv,
  Clock,
  Eye,
  BarChart2,
  TrendingUp,
  Users as User,
  Send,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { useDashboard } from "../hooks/useDashboard";
import { ChangePasswordModal } from "../components/ChangePassword";

type Message = {
  id: number;
  user: string;
  text: string;
};

type Chats = {
  [key: number]: Message[];
};

const mockChats: Chats = {
  1: [
    { id: 1, user: "João", text: "Vamos torcer!" },
    { id: 2, user: "Ana", text: "Boraaa 🔥" },
  ],
  2: [{ id: 1, user: "Carlos", text: "Ansioso por esse conteúdo!" }],
  3: [
    { id: 1, user: "Lia", text: "Já vai começar?" },
    { id: 2, user: "Pedro", text: "To aqui!" },
  ],
};

type LiveOption = {
  id: number;
  title: string;
};

const liveOptions: LiveOption[] = [
  { id: 1, title: "Gaming Live - Campeonato" },
  { id: 2, title: "Tutorial OBS Studio" },
  { id: 3, title: "Live de Setup" },
];

function LiveIndicator() {
  return (
    <Badge
      variant="outline"
      className="border-red-500 text-red-600 bg-red-100 px-2 py-1 flex items-center gap-2"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
      </span>
      Ao Vivo
    </Badge>
  );
}

export default function Dashboard() {
  const { user, setUser, handleGetUserById } = useLogin();
  const { ChangePasswordFristAcessModal } = useDashboard();
  const [selectedLiveId, setSelectedLiveId] = useState<number>(1);

  const [chats, setChats] = useState(mockChats);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const updated = { ...chats };
    updated[selectedLiveId] = [
      ...(updated[selectedLiveId] || []),
      {
        id: updated[selectedLiveId]?.length + 1 || 1,
        user: "Admin",
        text: newMessage,
      },
    ];
    setChats(updated);
    setNewMessage("");
  };

  useEffect(() => {
    if (!user?._id) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    const user = await handleGetUserById();
    setUser(user);
  };

  const livesAtivas = [
    {
      id: 1,
      title: "Gaming Live - Campeonato",
      description: "Transmissão ao vivo do campeonato de jogos",
      datetime: "20/01/2024 às 20:00",
      category: "gaming",
      views: 120,
    },
  ];

  const livesAgendadas = [
    {
      id: 1,
      title: "Tutorial OBS Studio",
      description: "Como configurar o OBS Studio para streaming profissional",
      datetime: "25/01/2024 às 14:00",
      category: "tutorial",
    },
  ];
  const atividades = [
    {
      id: 1,
      titulo: "Live Tutorial OBS",
      data: "25/01/2024 às 14:00",
      status: "Finalizada",
    },
    {
      id: 2,
      titulo: "Live ReactJS Avançado",
      data: "01/07/2025 às 18:00",
      status: "Ao Vivo",
    },
    {
      id: 3,
      titulo: "Live de Setup",
      data: "05/07/2025 às 20:00",
      status: "Agendada",
    },
  ];
  return (
    <div className="min-h-screen overflow-y-hidden">
      <>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo de volta! Aqui está o resumo das suas transmissões.
            </p>
          </div>
          <div className="text-sm text-green-700 bg-green-100 rounded-full px-3 py-1 font-medium">
            Sistema Online
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="bg-red-100 text-red-500 p-2 rounded-xl">
                  <Tv className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{livesAtivas.length}</div>
              </div>
              <p className="text-sm font-medium">Lives Ativas</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 " />
                <p className="text-xs text-muted-foreground">
                  {livesAtivas.length} transmitindo agora
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="bg-blue-100 text-blue-500  p-2 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">
                  {livesAgendadas.length}
                </div>
              </div>
              <p className="text-sm font-medium">Lives Agendadas</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 " />
                <p className="text-xs text-muted-foreground">
                  {livesAgendadas.length} próximas lives
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="bg-green-100 text-green-500 p-2 rounded-xl">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">
                  {livesAtivas.reduce((acc, cur) => acc + cur.views, 0)}
                </div>
              </div>
              <p className="text-sm font-medium">Total de Visualizações</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 " />
                <p className="text-xs text-muted-foreground">
                  {" "}
                  {livesAtivas.reduce((acc, cur) => acc + cur.views, 0)} Todas
                  as lives
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="bg-purple-100 text-purple-500 p-2 rounded-xl">
                  <User />
                </div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <p className="text-sm font-medium">Usuários Ativos</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 " />
                <p className="text-xs text-muted-foreground">0 total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <Card className="flex-1 shadow-sm">
            <CardContent className="p-4 space-y-4">
              <Label className="text-lg font-semibold">Lives Ativas</Label>

              {livesAtivas.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma live ativa no momento.
                </p>
              )}

              {livesAtivas.map((live) => (
                <div
                  key={live.id}
                  className="flex justify-between items-center border rounded p-4"
                >
                  <div className="flex items-center gap-4">
                    <LiveIndicator />

                    <div>
                      <h3 className="font-semibold">{live.title}</h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {live.description}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {live.datetime} -{" "}
                        <span className="capitalize">{live.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Eye className="w-5 h-5" />
                      <span className="font-semibold">{live.views}</span>
                    </div>
                    {/* <Button variant="destructive" size="sm">Parar</Button> */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1 shadow-sm">
            <CardContent className="p-4 space-y-4">
              <Label className="text-lg font-semibold">Próximas Lives</Label>

              {livesAgendadas.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma live agendada.
                </p>
              )}

              {livesAgendadas.map((live) => (
                <div
                  key={live.id}
                  className="flex justify-between items-center border rounded p-4"
                >
                  <div>
                    <h3 className="font-semibold">{live.title}</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {live.description}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      {live.datetime} -{" "}
                      <span className="capitalize">{live.category}</span>
                    </p>
                  </div>

                  {/* <Button size="sm">Iniciar</Button> */}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <Card className="shadow-sm">
            <CardContent className="p-4 space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Atividade Recente
              </Label>

              {atividades.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                      <Tv className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {item.titulo}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.data}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      item.status === "Ao Vivo"
                        ? "border-red-500 text-red-600 bg-red-100"
                        : item.status === "Agendada"
                        ? "border-blue-500 text-blue-600 bg-blue-100"
                        : "border-gray-400 text-gray-600 bg-gray-100"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" /> Estatísticas
                Rápidas
              </Label>
              <ul className="text-sm mt-2 space-y-1">
                <li className="flex justify-between">
                  Lives Finalizadas <span>0</span>
                </li>
                <li className="flex justify-between text-destructive">
                  Lives Canceladas <span>0</span>
                </li>
                <li className="flex justify-between">
                  Média de Visualizações <span>0</span>
                </li>
                <li className="flex justify-between text-green-600">
                  Usuários Cadastrados <span>0</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-sm col-span-1 lg:col-span-3">
            <CardContent className="p-4 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">
                  💬 Chat das Lives
                </Label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedLiveId}
                  onChange={(e) => setSelectedLiveId(Number(e.target.value))}
                >
                  {liveOptions.map((live) => (
                    <option key={live.id} value={live.id}>
                      {live.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 border rounded-md p-3 bg-gray-50">
                {(chats[selectedLiveId] || []).map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <strong>{msg.user}: </strong>
                    <span>{msg.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                {/* <Input
                  placeholder="Digite sua mensagem como admin..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                /> */}
                {/* <Button onClick={handleSend}>
                  <Send className="w-4 h-4" />
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
      <ChangePasswordModal isOpen={ChangePasswordFristAcessModal} />
    </div>
  );
}
