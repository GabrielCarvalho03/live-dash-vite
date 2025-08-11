import { useEffect, useState } from "react";
import { allVinculationProductsObj } from "@/modules/live/hooks/types";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { DeleteConfirmModal } from "@/shared/components/deleteConfirmModal/deleteConfirmModal";

type EditProductLiveProps = {
  listLive: allVinculationProductsObj[];
};

export const EditProductLive = ({ listLive }: EditProductLiveProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const {
    listProductsEdited,
    openDeleteVinculationProductModal,
    loadingDeleteVinculationProducts,
    vinculationProductsObject,
    setListProductsEdited,
    handleChange,
    addProduct,
    handleDragEnd,
    handleDeleteVinculationProduct,
    setOpenDeleteVinculationProductModal,
    setVinculationProductsObject,
  } = useVinculationProductsLive();

  useEffect(() => {
    if (listLive) {
      setListProductsEdited(listLive);
    }
  }, []);

  const [activeAccordion, setActiveAccordion] = useState("");
  const [removeIndex, setRemoveIndex] = useState<number>(0);
  const items = listProductsEdited?.map(
    (product) => product._id || `temp-${Math.random()}`
  );

  return (
    <div className="my-5">
      <Label className="font-normal text-md">
        Produtos cadastros nessa live
      </Label>

      <section className="mt-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {listProductsEdited?.map((product, index) => (
              <SortableItem key={product._id} id={product._id}>
                {({ setNodeRef, style, listeners, attributes }) => (
                  <div ref={setNodeRef} style={style}>
                    <Accordion
                      type="single"
                      collapsible
                      value={activeAccordion}
                      onValueChange={setActiveAccordion}
                    >
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className="font-normal flex justify-between items-center">
                          <div className="flex gap-3">
                            <span
                              {...listeners}
                              {...attributes}
                              className="cursor-grab text-gray-500 ml-2"
                              onClick={(e) => e.stopPropagation()} // impede conflito com accordion
                            >
                              ⠿
                            </span>
                            Produto {index + 1}
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid gap-2">
                            <Label>Nome do produto</Label>
                            <Input
                              value={product.name}
                              onChange={(e) =>
                                handleChange(index, "name", e.target.value)
                              }
                            />

                            <Label>Link do produto</Label>
                            <Input
                              value={product.link}
                              onChange={(e) =>
                                handleChange(index, "link", e.target.value)
                              }
                            />

                            <Label>Horário de início</Label>
                            <input
                              type="time"
                              value={product.hourStart}
                              onChange={(e) =>
                                handleChange(index, "hourStart", e.target.value)
                              }
                            />

                            <Label>Horário de fim</Label>
                            <input
                              type="time"
                              value={product.hourEnd}
                              onChange={(e) =>
                                handleChange(index, "hourEnd", e.target.value)
                              }
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                setVinculationProductsObject(product);
                                setOpenDeleteVinculationProductModal(true);
                                setRemoveIndex(index);
                              }}
                            >
                              Remover produto
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </section>

      <button
        type="button"
        onClick={addProduct}
        className="my-4 self-start text-blue-600 hover:underline text-sm"
      >
        Adicionar Produto +
      </button>

      <DeleteConfirmModal
        isOpen={openDeleteVinculationProductModal}
        loading={loadingDeleteVinculationProducts}
        onClose={() => setOpenDeleteVinculationProductModal(false)}
        onDelete={() =>
          handleDeleteVinculationProduct(vinculationProductsObject, removeIndex)
        }
      />
    </div>
  );
};
