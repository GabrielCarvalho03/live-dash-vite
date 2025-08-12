"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Filter, Pencil, Trash, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { useLive } from "../../hooks/useLive";
import { StatusLive } from "../statusLive/statusLive";
import { CategorieLive } from "../categorieLive/categorieLive";
import { ProductVinculationModal } from "../createLiveSteps/products/form";
import { CreateLiveStepsModal } from "../createLiveSteps/createLiveSteps";
import { useVinculationProductsLive } from "../../hooks/useVinculationProducts";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";
import { FilterProductContent } from "../filters/filterProductContent";
import { NotFoundTable } from "../notFoundTable/notFoundTable";

export default function ProductsContent() {
  const {
    modalCreateLiveIsOpen,
    liveList,
    setModalCreateLiveIsOpen,
    openVinculationProductModal,
    setOpenVinculationProductModal,
  } = useLive();

  const { user, setUser, handleGetUserById } = useLogin();

  const {
    loadingisGetAllVinculationProduct,
    allVinculationProducts,
    vinculationProductsObject,
    openDeleteVinculationProductModal,
    loadingDeleteVinculationProducts,
    allVinculationProductsFiltered,
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
      <FilterProductContent />

      <div className="w-full">
        {!allVinculationProducts.length ? (
          <NotFoundTable />
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-6 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 border-b">
              <span className="text-left">Produto</span>
              <span className="text-left ml-16">Status</span>
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
              allVinculationProductsFiltered?.map((products, index) => {
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

                    <div className="mb-2 ml-14 md:mb-0">
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
          </>
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
