import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

import {
  VinculationProductsLiveSchema,
  VinculationProductsLiveSchemaData,
} from "@/modules/live/hooks/vinculationProductsLiveSchema";
import { useState } from "react";
import { useLive } from "@/modules/live/hooks/useLive";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { Loader2 } from "lucide-react";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProductVinculationModal = ({
  isOpen,
  onClose,
}: CreateUserFormProps) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("");
  const { liveEditObject } = useLive();
  const { loadingVinculationProduct, handleAddVinculationProduct } =
    useVinculationProductsLive();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VinculationProductsLiveSchemaData>({
    resolver: zodResolver(VinculationProductsLiveSchema),
    defaultValues: {
      products: [{ name: "", link: "", hourStart: "", hourEnd: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = (data: VinculationProductsLiveSchemaData) => {
    handleAddVinculationProduct(data);
  };

  const onError = (errors: FieldErrors<VinculationProductsLiveSchemaData>) => {
    if (Array.isArray(errors.products)) {
      const firstErrorIndex = errors.products.findIndex((item) => !!item);
      if (firstErrorIndex !== -1) {
        setActiveAccordion(`item-${firstErrorIndex}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 -inset-y-10 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="w-4/12 shadow-lg border-none bg-white z-10  ">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Vincular produto: {liveEditObject.title}.
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os campos abaixo para vincular um produto à live.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            {fields.map((field, index) => (
              <Accordion
                type="single"
                collapsible
                key={field.id}
                value={activeAccordion}
                onValueChange={(value) => setActiveAccordion(value)}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="font-normal">
                    Produto {index + 1}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      <Label>Nome do produto</Label>
                      <Input {...register(`products.${index}.name`)} />
                      {errors.products?.[index]?.name && (
                        <p className="text-red-500 text-xs">
                          {errors.products[index]?.name?.message}
                        </p>
                      )}
                      <Label>Link do produto</Label>
                      <Input {...register(`products.${index}.link`)} />
                      {errors.products?.[index]?.link && (
                        <p className="text-red-500 text-xs">
                          {errors.products[index]?.link?.message}
                        </p>
                      )}
                      <Label>Horário de início</Label>
                      <input
                        type="time"
                        {...register(`products.${index}.hourStart`)}
                      />{" "}
                      {errors.products?.[index]?.hourStart && (
                        <p className="text-red-500 text-xs">
                          {errors.products[index]?.hourStart?.message}
                        </p>
                      )}
                      <Label>Horário de fim</Label>
                      <input
                        type="time"
                        {...register(`products.${index}.hourEnd`)}
                      />
                      {errors.products?.[index]?.hourEnd && (
                        <p className="text-red-500 text-xs">
                          {errors.products[index]?.hourEnd?.message}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Remover produto
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}

            {fields.length <= 3 && (
              <button
                type="button"
                onClick={() =>
                  append({ name: "", link: "", hourStart: "", hourEnd: "" })
                }
                className="self-start text-blue-600 hover:underline text-sm"
              >
                Adicionar produto +
              </button>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              disabled={loadingVinculationProduct}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loadingVinculationProduct ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Vincular"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
