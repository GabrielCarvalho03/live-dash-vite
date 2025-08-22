"use client";

import { useState, useMemo } from "react";

import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { useDashboard } from "../hooks/useDashboard";
import { ChangePasswordModal } from "../components/ChangePassword";
import { useLive } from "@/modules/live/hooks/useLive";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { useFetchUserOnMount } from "../hooks/useFetchUserOnMount";
import { useFetchLivesForUser } from "../hooks/useFetchLivesForUser";
import { useNotifyHighlightedProducts } from "../hooks/useNotifyHighlightedProducts";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { useGetProductsInRealTime } from "@/modules/dashboard/hooks/realtime/useGetProductsInRealTime";

import { GetLiveForUserOrAdmin } from "@/shared/utils/getLiveForUserOrAdmin";

import { Separator } from "@radix-ui/react-separator";
import { Loader } from "@/shared/components/loader/loader";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";

import { CreateProductsDrawer } from "@/shared/components/drawers/CreateProducts.drawer";

import { DashboardCards } from "../components/dashboardCards/dashboardCards";
import { LiveSection } from "../components/liveSection/liveSection";
import { ProductsSection } from "../components/productsSection/productsSection";
import { NextLiveSection } from "../components/nextLiveSection/nextLiveSection";
import { DashboardHeader } from "../components/dashboardHeader/dashboardHeader";

export default function Dashboard() {
  const { user, setUser, handleGetUserById, loginisLoading } = useLogin();
  const { liveList, loadingLiveList } = useLive();
  const { allVinculationProducts } = useVinculationProductsLive();
  const [horaMinutoAtual] = useState("00:00");

  const {
    openModalCreateProducts,
    productObjForDeleteOrEdit,
    openModalConfirmDeleteProductInLive,
    loadingDeleteProduct,
    loadingCreateProducts,
    setOpenModalConfirmDeleteProductInLive,
    setHighlightedProductList,
    setOpenModalCreateProducts,
    handleDeleteProduct,
  } = useCreateProductsDrawer();

  const {
    ChangePasswordFristAcessModal,
    openDeleteLiveModal,
    deleteLiveISLoading,
    setOpenDeleteLiveModal,
    handleDeleteLive,
    actualLive,
    setActualLive,
  } = useDashboard();

  const livesAtivas = useMemo(
    () => liveList?.filter((item) => item.status == "live"),
    [liveList]
  );
  const liveId = actualLive?._id ?? livesAtivas[0]?._id;
  const produtosVisiveis = useMemo(
    () =>
      allVinculationProducts.filter(
        (produto) =>
          horaMinutoAtual >= produto.hourStart &&
          horaMinutoAtual <= produto.hourEnd
      ),
    [allVinculationProducts, horaMinutoAtual]
  );

  const getUser = async () => {
    const user = await handleGetUserById();
    GetLiveForUserOrAdmin(user);
    setUser(user);
  };

  useFetchUserOnMount(user?._id, getUser);
  useGetProductsInRealTime({ liveId, setHighlightedProductList });
  useFetchLivesForUser(user, liveList);
  useNotifyHighlightedProducts(produtosVisiveis);

  return (
    <div className="min-h-screen overflow-y-hidden mb-5 ">
      <>
        <DashboardHeader />
        <Separator />
        {loadingLiveList || loginisLoading ? (
          <Loader />
        ) : (
          <>
            <DashboardCards />
            <div className="flex flex-col lg:flex-row gap-4 mt-6">
              <LiveSection />
              <ProductsSection />
            </div>
            <NextLiveSection />
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
            liveId: liveId,
            productId: productObjForDeleteOrEdit?.id ?? "",
          })
        }
        loading={loadingDeleteProduct}
      />

      <CreateProductsDrawer
        liveId={liveId}
        isOpen={openModalCreateProducts}
        onClose={() => setOpenModalCreateProducts(false)}
        loading={loadingCreateProducts}
      />
    </div>
  );
}
