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
  CirclePlay,
} from "lucide-react";
import { useEffect, useRef } from "react";
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
import { FilterLiveContent } from "../filters/filterLiveContent";
import { NotFoundTable } from "../notFoundTable/notFoundTable";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/shared/components/ConfirmModal/confirmModal";

export default function LiveContent() {
  const navigate = useNavigate();
  const {
    modalCreateLiveIsOpen,
    liveList,
    liveEdit,
    setLiveEdit,
    setModalCreateLiveIsOpen,
    handleGetLive,
  } = useLive();
  const { allVinculationProducts, handleGetAllVinculationProduct } =
    useVinculationProductsLive();

  const { user, setUser, handleGetUserById } = useLogin();
  const {
    openVinculationProductModal,
    openDeleteLiveModal,
    liveEditObject,
    loadingDeleteLive,
    loadingLiveList,
    liveListFilter,
    setLoadingLiveList,
    setOpenDeleteLiveModal,
    setLiveEditObject,
    setOpenVinculationProductModal,
    handleDeleteLive,
    handleGetLiveByUser,
  } = useLive();

  const hasFetchedLives = useRef(false);

  useEffect(() => {
    if (hasFetchedLives.current) return;
    if (user?.userType === "Admin") {
      handleGetLive();
      hasFetchedLives.current = true;
      return;
    }
    if (user?.userType === "User") {
      handleGetLiveByUser(user?._id);
      hasFetchedLives.current = true;
    }
  }, [user]);

  const verifyLiveForEdit = (data: liveObject) => {
    if (data.status === "live") {
      toast.error("Não é possivel editar", {
        description: "Não é posssivel editar live que está no ar.",
      });

      return;
    }

    if (data.status == "finished") {
      toast.error("Não é possivel editar", {
        description: "Não é posssivel editar live que foi finalizada.",
      });
      return;
    }
    setModalCreateLiveIsOpen(true);
    setLiveEditObject(data);
    setLiveEdit(true);
  };

  return (
    <div className="space-y-6">
      {loadingLiveList ? (
        <div className="flex justify-center items-center mt-40">
          <Loader2 className="w-12 h-12  text-blue-500 animate-spin " />
        </div>
      ) : (
        <>
          {liveList.length > 0 && <FilterLiveContent />}
          {!loadingLiveList && !liveList.length && <NotFoundTable />}

          <div className="w-full">
            {!loadingLiveList &&
              liveList.length > 0 &&
              liveListFilter?.length > 0 && (
                <>
                  <div className="hidden md:grid md:grid-cols-6 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 border-b">
                    <span className="text-left">Live</span>
                    <span className="text-left ml-20">Status</span>
                    <span className="text-left">Categoria</span>
                    <span className="text-left">Data/Hora</span>
                    <span className="text-left">produtos vinculados</span>
                    <span className="text-left">Ações</span>
                  </div>

                  {!liveListFilter.length ? (
                    <NotFoundTable />
                  ) : (
                    liveListFilter?.map((live, index) => {
                      const productOfLive = allVinculationProducts.find(
                        (item) => item.liveId === live._id
                      );
                      const productsVinculateTotalLive =
                        allVinculationProducts.filter(
                          (item) => item.liveId === live._id
                        );

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

                            {(live.status === "live" ||
                              live.status === "scheduled") && (
                              <div className="mt-2 text-xs bg-yellow-100 text-yellow-900 p-2 border border-yellow-400 rounded-md w-fit max-w-full leading-tight">
                                <p>
                                  <strong>🔑 OBS:</strong>{" "}
                                  {live.streamKey ?? ""}
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

                          <div className="mb-2 ml-16   md:mb-0">
                            <StatusLive status={live.status} />
                          </div>

                          <div className="mb-2 md:mb-0">
                            <CategorieLive categorie={live?.category} />
                          </div>

                          <div className="mb-2 md:mb-0">
                            <section className="flex flex-col gap-2">
                              <span>
                                {dayjs(live.dayLive?.date).format(
                                  "DD/MM/YYYY"
                                ) +
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
                            {live.status === "scheduled" && (
                              <Button
                                onClick={() => {}}
                                size="icon"
                                variant="ghost"
                              >
                                <CirclePlay className="w-4 h-4 text-red-600 " />
                              </Button>
                            )}
                            {live.status === "live" ? (
                              <Button
                                onClick={() => navigate("/dashboard")}
                                size="icon"
                                variant="ghost"
                              >
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
                </>
              )}
          </div>
        </>
      )}

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

      <ConfirmModal
        title="Tem certeza que deseja iniciar uma live?"
        description="Se estiver no horário marcado, ignore esta mensagem."
        actionButtonText="Iniciar Live"
        isOpen={false}
        loading={false}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
}
