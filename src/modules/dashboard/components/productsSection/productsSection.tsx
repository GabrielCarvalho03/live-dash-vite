import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { Label } from "@radix-ui/react-label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { NotProductsInHighlight } from "../notProductsInHighlight/notProductsInHighlight";
import { useState } from "react";
import { liveObject } from "@/modules/live/hooks/types";
import { useLive } from "@/modules/live/hooks/useLive";
import { SortableItem } from "@/modules/live/components/EditProductInLiveModal/SortableItem";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { useHandleProductDragEnd } from "../../hooks/realtime/useHandleProductDragEnd";
import { useDashboard } from "../../hooks/useDashboard";

export const ProductsSection = () => {
  const {
    highlightedProductList,
    setOpenModalConfirmDeleteProductInLive,
    setHighlightedProductList,
    setOpenModalCreateProducts,
    setProductObjForDeleteOrEdit,
  } = useCreateProductsDrawer();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { liveList } = useLive();
  const { actualLive } = useDashboard();

  const livesAtivas = liveList?.filter((item) => item.status == "live");
  const liveId = actualLive?._id ?? livesAtivas[0]?._id;
  const handleDragEnd = useHandleProductDragEnd(
    liveId,
    highlightedProductList,
    setHighlightedProductList
  );

  return (
    <Card className="flex-1 shadow-sm max-h-[520px]">
      <CardContent className="p-4 space-y-4  ">
        <Label className="text-sm font-normal  text-purple-700 bg-purple-100 px-2 py-1 rounded">
          Em destaque
        </Label>
      </CardContent>
      <CardContent className="p-4 space-y-4 max-h-[380px] min-h-[380px] overflow-y-auto">
        {highlightedProductList.length === 0 && <NotProductsInHighlight />}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={highlightedProductList?.map((item) => item._id) || []}
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
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="font-semibold text-lg">
                          {item.price}
                        </span>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setOpenModalConfirmDeleteProductInLive(true);
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
  );
};
