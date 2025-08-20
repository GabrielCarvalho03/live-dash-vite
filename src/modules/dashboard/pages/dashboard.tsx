"use client";

import { useEffect, useState, useRef } from "react";
import {
  Tv,
  Clock,
  Eye,
  Users,
  CircleStop,
  Trash2,
  Calendar,
  Clock2,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Button } from "@/shared/components/ui/button";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { useDashboard } from "../hooks/useDashboard";
import { ChangePasswordModal } from "../components/ChangePassword";
import { PlayerWithControls } from "../components/playerLiveWithButtons/playerLiveWithButtons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useLive } from "@/modules/live/hooks/useLive";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/shared/components/ui/select";
import dayjs from "dayjs";
import { NotLive } from "../components/notLive/notLive";
import { liveObject } from "@/modules/live/hooks/types";
import { GetLiveForUserOrAdmin } from "@/shared/utils/getLiveForUserOrAdmin";
import { Loader } from "@/shared/components/loader/loader";
import { ChatComponent } from "../components/chatComponent/chatComponent";
import { useUser } from "@/modules/users/hooks/useUser";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";
import { CardComponent } from "../components/card/card";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/modules/live/components/EditProductInLiveModal/SortableItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CreateProductsDrawer } from "@/shared/components/drawers/CreateProducts.drawer";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/firebase";
import { off, onValue, ref, set } from "firebase/database";
import { toast } from "sonner";
import { NotProductsInHighlight } from "../components/notProductsInHighlight/notProductsInHighlight";

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
  const { user, setUser, handleGetUserById, loginisLoading } = useLogin();
  const { liveList, loadingLiveList } = useLive();
  const {
    openModalCreateProducts,
    highlightedProductList,
    productObjForDeleteOrEdit,
    openModalConfirmDeleteProductInLive,
    loadingDeleteProduct,
    loadingCreateProducts,
    setOpenModalConfirmDeleteProductInLive,
    setHighlightedProductList,
    setOpenModalCreateProducts,
    handleDeleteProduct,
    setProductObjForDeleteOrEdit,
  } = useCreateProductsDrawer();

  const {
    ChangePasswordFristAcessModal,
    openDeleteLiveModal,
    deleteLiveISLoading,
    setOpenDeleteLiveModal,
    handleDeleteLive,
  } = useDashboard();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [actualLive, setActualLive] = useState<liveObject | undefined>(
    {} as liveObject
  );
  const { userVinculateLive, getUSerVinculateLive } = useUser();
  const livesAtivas = liveList?.filter((item) => item.status == "live");

  useEffect(() => {
    if (!user?._id) {
      getUser();
    }
  }, []);

  useEffect(() => {
    const liveId = actualLive?._id ?? livesAtivas[0]?._id;
    if (!liveId) return;

    const productsRef = ref(db, `products/${liveId}`);

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let productsArray = [];
        if (Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (typeof data.products === "object") {
          productsArray = Object.values(data.products);
        } else if (Array.isArray(data)) {
          productsArray = data;
        } else if (typeof data === "object") {
          productsArray = Object.values(data);
        }
        setHighlightedProductList(productsArray);
      } else {
        setHighlightedProductList([]);
      }
    });

    return () => {
      off(productsRef);
      unsubscribe();
    };
  }, [actualLive?._id, livesAtivas[0]?._id]);

  const handleDragEnd = async (event: any) => {
    const productsRef = ref(
      db,
      `products/${actualLive?._id ?? livesAtivas[0]?._id}`
    );

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = highlightedProductList.findIndex(
      (item) => item._id === active.id
    );
    const newIndex = highlightedProductList.findIndex(
      (item) => item._id === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const newList = [...highlightedProductList];
      const [moved] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, moved);
      setHighlightedProductList(newList);

      await set(productsRef, {
        products: newList,
      });

      toast.success("Ordem dos produtos atualizada com sucesso!", {
        duration: 3000,
      });
    }
  };

  const hasFetchedLives = useRef(false);

  useEffect(() => {
    if (hasFetchedLives.current) return;
    if (!liveList.length) {
      GetLiveForUserOrAdmin(user);
      hasFetchedLives.current = true;
    }
  }, [user?._id]);

  const getUser = async () => {
    const user = await handleGetUserById();
    GetLiveForUserOrAdmin(user);
    setUser(user);
  };

  const livesAgendadas = liveList?.filter((item) => item.status == "scheduled");
  const NextLive = livesAgendadas?.sort((a, b) => {
    const aDate = dayjs(a.dayLive?.date).valueOf();
    const bDate = dayjs(b.dayLive?.date).valueOf();
    return aDate - bDate;
  });

  return (
    <div className="min-h-screen overflow-y-hidden mb-5">
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

        {loadingLiveList || loginisLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <CardComponent
                title="Lives Ativas"
                description="transmitindo agora"
                countTotal={livesAtivas.length}
                Icon={Tv}
                countNow={livesAtivas.length}
              />

              <CardComponent
                title="Lives Agendadas"
                description="próximas lives"
                countTotal={livesAgendadas.length}
                Icon={Clock}
                countNow={livesAgendadas.length}
                className="bg-blue-100 text-blue-500"
              />

              <CardComponent
                title="Total de Visualizações"
                description="   Todas as lives"
                countTotal={livesAgendadas.length}
                Icon={Eye}
                countNow={livesAgendadas.length}
                className="bg-green-100 text-green-500"
              />

              <CardComponent
                title="Usuários Ativos"
                description=" Total"
                countTotal={0}
                Icon={Users}
                countNow={0}
                className="bg-purple-100 text-purple-500"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mt-6">
              <Card className="flex-1 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="w-full flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      {user?.userType === "Admin"
                        ? "Lives Ativas"
                        : "Live Ativa"}
                    </Label>

                    <div className=" flex items-center gap-3">
                      {user?.userType === "Admin" && livesAtivas.length > 0 && (
                        <Select
                          defaultValue={livesAtivas[0]?._id}
                          value={actualLive?._id}
                          onValueChange={async (e) => {
                            const actualLive = liveList.find(
                              (item) => item._id == e
                            );
                            await getUSerVinculateLive(actualLive);
                            setActualLive(actualLive);
                          }}
                        >
                          <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Filtrar por status" />
                          </SelectTrigger>
                          <SelectContent>
                            {livesAtivas.map((item) => (
                              <SelectItem value={item._id}>
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {livesAtivas.length > 0 && (
                        <Button
                          onClick={() => setOpenDeleteLiveModal(true)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <CircleStop />
                        </Button>
                      )}
                    </div>
                  </div>

                  {livesAtivas.length === 0 ? (
                    <NotLive />
                  ) : (
                    <>
                      <div
                        key={actualLive?._id}
                        className="flex justify-between items-center border rounded p-4"
                      >
                        <div className="w-full  flex items-center gap-4">
                          <LiveIndicator />

                          <div className="">
                            <h3 className="font-semibold">
                              {actualLive?.title ?? livesAtivas[0]?.title}
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-sm">
                              {actualLive?.description ??
                                livesAtivas[0]?.description}
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground">
                              {dayjs(
                                actualLive?.dayLive?.date ??
                                  livesAtivas[0]?.dayLive?.date
                              ).format("DD/MM/YYYY  HH:mm")}{" "}
                              -{" "}
                              <span className="capitalize">
                                {actualLive?.category ??
                                  livesAtivas[0]?.category}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Eye className="w-5 h-5" />
                            <span className="font-semibold">
                              {actualLive?.views ?? liveList[0]?.views ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <section className="flex w-full gap-4">
                        <div className="w-6/12 ">
                          <PlayerWithControls
                            key={actualLive?._id ?? livesAtivas[0]?._id}
                            src={[
                              {
                                src: `https://livepeercdn.studio/hls/${
                                  actualLive?.url_play ??
                                  livesAtivas[0]?.url_play
                                }/index.m3u8`,
                                height: 300,
                                mime: "application/mp4",
                                type: "hls",
                                width: 900,
                              },
                            ]}
                          />

                          <article className="mb-2 mt-5">
                            <div className="flex items-center gap-1 mt-3   ">
                              <Avatar>
                                <AvatarImage
                                  src={userVinculateLive?.avatar}
                                  alt="@shadcn"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="flex ">
                                <span className="font-semibold">
                                  {userVinculateLive?.name} -{" "}
                                </span>
                                <Badge
                                  className={`${
                                    userVinculateLive?.userType === "Admin"
                                      ? "border-red-500 text-red-600 bg-red-100 ml-2"
                                      : "border-blue-500 text-blue-600 bg-blue-100  ml-2"
                                  } px-2 py-1 flex items-center gap-2 '}`}
                                >
                                  {userVinculateLive?.userType === "Admin"
                                    ? "admin"
                                    : "Criador de live"}
                                </Badge>
                              </div>
                            </div>
                          </article>
                        </div>

                        <div className="w-[0.5px] bg-gray-300 max-h-[400px] min-h-[280px]" />
                        <ChatComponent
                          liveId={actualLive?._id ?? livesAtivas[0]?._id}
                        />
                      </section>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="flex-1 shadow-sm max-h-[520px]">
                <CardContent className="p-4 space-y-4  ">
                  <Label className="text-sm font-normal  text-purple-700 bg-purple-100 px-2 py-1 rounded">
                    Em destaque
                  </Label>
                </CardContent>
                <CardContent className="p-4 space-y-4 max-h-[380px] min-h-[380px] overflow-y-auto">
                  {highlightedProductList.length === 0 && (
                    <NotProductsInHighlight />
                  )}

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={
                        highlightedProductList?.map((item) => item._id) || []
                      }
                      strategy={verticalListSortingStrategy}
                    >
                      {highlightedProductList?.map((item, index) => (
                        <SortableItem key={item._id} id={item._id}>
                          {({ setNodeRef, style, listeners, attributes }) => (
                            <div ref={setNodeRef} style={style}>
                              <div
                                key={item._id}
                                className="flex items-center justify-between border rounded-md p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    {...listeners}
                                    {...attributes}
                                    className="cursor-grab text-gray-500 ml-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    ⠿
                                  </span>
                                  <div className="">
                                    <img
                                      src={item.imageMain}
                                      className="w-10 rounded-lg"
                                    />
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm">
                                      {item.name}
                                    </span>
                                    {/* <span className="text-xs text-muted-foreground">
                                      {item.}
                                    </span> */}
                                  </div>
                                </div>

                                <div className="flex items-center gap-5">
                                  <span className="font-semibold text-lg">
                                    {item.price}
                                  </span>

                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      setOpenModalConfirmDeleteProductInLive(
                                        true
                                      );
                                      setProductObjForDeleteOrEdit(item);
                                    }}
                                  >
                                    <Trash2 className="text-red-500 w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                </CardContent>
                {highlightedProductList.length > 0 && (
                  <CardFooter className="pt-5 border-t-[0.5px]">
                    <section className="w-full flex justify-between items-center">
                      <div className="w-6/12"></div>

                      <div className="w-6/12 flex justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          className="hover:bg-blue-500 hover:text-white"
                          onClick={() => {
                            setOpenModalCreateProducts(true);
                          }}
                        >
                          Adicionar Produtos
                        </Button>
                      </div>
                    </section>
                  </CardFooter>
                )}
              </Card>
            </div>

            <Card className="shadow-sm w-full  mt-10 min-h-[300px]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Próxima Live
                </CardTitle>
              </CardHeader>

              <CardContent className="w-full px-10 0">
                {NextLive?.map((item, index) => {
                  return (
                    <div key={item._id} className="flex flex-col">
                      <div
                        key={item._id}
                        className="flex items-center justify-between border-b rounded-md p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />

                              <span className="font-semibold text-base ">
                                {item.title}
                              </span>
                            </div>

                            <div className="fex gap-5">
                              <span className="font-normal text-gray-400 text-sm">
                                {format(item.dayLive.date, "d 'de' MMM yyyy", {
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                            {/* <span className="text-xs text-muted-foreground">
                                      {item.}
                                    </span> */}
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <Badge className="bg-blue-950   ">
                            {/*  */}

                            <span className="pr-3">
                              <Clock2 className="w-4 h-4" />
                            </span>

                            <span className="">{"Agendada"}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <RecentsActivity />

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
            </div> */}
          </>
        )}
      </>
      <ChangePasswordModal isOpen={ChangePasswordFristAcessModal} />
      <DeleteConfirmModal
        title="Tem certeza que deseja encerrar a live?"
        actionButtonText="Encerrar"
        isOpen={openDeleteLiveModal}
        onClose={() => setOpenDeleteLiveModal(false)}
        onDelete={() =>
          handleDeleteLive({
            id: actualLive?.steamID ?? livesAtivas[0]?.steamID,
            setActualLive,
          })
        }
        loading={deleteLiveISLoading}
      />
      <DeleteConfirmModal
        title="Tem certeza que deseja apagar ? "
        description="Essa ação não pode ser desfeita."
        actionButtonText="Apagar"
        isOpen={openModalConfirmDeleteProductInLive}
        onClose={() => setOpenModalConfirmDeleteProductInLive(false)}
        onDelete={() =>
          handleDeleteProduct({
            liveId: actualLive?._id ?? livesAtivas[0]?._id,
            productId: productObjForDeleteOrEdit?._id ?? "",
          })
        }
        loading={loadingDeleteProduct}
      />

      <CreateProductsDrawer
        liveId={actualLive?._id ?? livesAtivas[0]?._id}
        isOpen={openModalCreateProducts}
        onClose={() => setOpenModalCreateProducts(false)}
        loading={loadingCreateProducts}
      />
    </div>
  );
}
