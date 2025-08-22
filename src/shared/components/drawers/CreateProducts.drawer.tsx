import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { useLive } from "@/modules/live/hooks/useLive";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

type createProductsDrawerProps = {
  liveId?: string;
  isOpen: boolean;
  loading: boolean;
  isProductLive?: boolean;
  onClose: () => void;
};

export const CreateProductsDrawer = ({
  liveId,
  isOpen,
  loading,
  isProductLive,
  onClose,
}: createProductsDrawerProps) => {
  const [productLinkInput, setProductLinkInput] = useState("");
  const [liveVinculateId, setLiveVinculateId] = useState("");
  const [productHours, setProductHours] = useState({
    hourStart: "",
    hourEnd: "",
  });
  const [formErrors, setFormErrors] = useState({
    liveVinculateId: "",
    hourStart: "",
    hourEnd: "",
  });
  const {
    searchProductsIsLoading,
    productObject,
    getIdByLink,
    productId,
    handleCreateProducts,
    handleGetProductById,
  } = useCreateProductsDrawer();
  const { liveList } = useLive();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <form className="grid gap-5 mt-10 ">
        <SheetContent className=" px-2 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Produtos</SheetTitle>
            <SheetDescription>
              Adicione ou edite seus produtos.
            </SheetDescription>
          </SheetHeader>

          <section className="w-full grid gap-5 mt-10">
            <Label>Insira o link do produto</Label>
            <Input
              placeholder="https://sampa.buscabusca.com.br/exemple/id_products"
              value={productLinkInput}
              onChange={(e) => {
                setProductLinkInput(e.target.value);
              }}
            />

            <Button
              disabled={searchProductsIsLoading}
              type="button"
              className="bg-blue-500  "
              onClick={() => {
                getIdByLink(productLinkInput);
                handleGetProductById(productId ?? "");
              }}
            >
              {searchProductsIsLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Buscar produto"
              )}
            </Button>
          </section>
          {productObject?._id && (
            <section className="w-full grid gap-5 mt-10">
              <h1>
                Produto ID:{" "}
                <span className=" px-2 py-1 bg-purple-100 rounded-lg text-purple-600 ">
                  {productObject._id}
                </span>{" "}
              </h1>

              <section className="">
                <div className="my-5">
                  <Label>Imagem do produto</Label>
                  <div className="w-full flex flex-col justify-center items-center my-3">
                    <img
                      className="w-40 object-cover rounded-lg mt-5"
                      src={productObject?.imageMain}
                      alt=""
                    />

                    {productObject?.imagesSecondary.length! > 0 && (
                      <Carousel
                        opts={{
                          align: "start",
                        }}
                        className="w-full max-w-[280px] relative mt-10"
                      >
                        <CarouselContent className="w-full flex justify-center">
                          {productObject?.imagesSecondary?.map(
                            (image, index) => (
                              <CarouselItem key={index} className="basis-1/3">
                                <div className="p-1">
                                  <Card>
                                    <img
                                      className="w-24  object-cover rounded-lg"
                                      src={image}
                                      alt=""
                                    />
                                  </Card>
                                </div>
                              </CarouselItem>
                            )
                          )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 z-10" />
                      </Carousel>
                    )}
                  </div>
                </div>

                <div className="my-5">
                  <Label>Nome</Label>
                  <Input
                    className="mt-2"
                    value={"CAMERA IP WIFI INTELIGENTE 8177"}
                    readOnly
                  />
                </div>

                <div>
                  <Label>Preço</Label>
                  <Input
                    className="mt-2"
                    value={productObject?.price}
                    readOnly
                  />
                </div>

                <div className="my-5">
                  <Label>Descrição</Label>
                  <Input
                    className="mt-2"
                    value={"Descrição do produto..."}
                    readOnly
                  />
                </div>

                {isProductLive && (
                  <>
                    <div className="my-5 w-full flex justify-between items-center gap-3">
                      <div className=" w-6/12">
                        <Label>Hora inicial</Label>
                        <Input
                          type="time"
                          className="mt-2"
                          value={productHours.hourStart}
                          onChange={(e) => {
                            setProductHours((prev) => ({
                              ...prev,
                              hourStart: e.target.value,
                            }));
                            setFormErrors((prev) => ({
                              ...prev,
                              hourStart: "",
                            }));
                          }}
                        />
                        {formErrors.hourStart && (
                          <span className="text-red-500 text-xs mt-1 block">
                            {formErrors.hourStart}
                          </span>
                        )}
                      </div>

                      <div className=" w-6/12">
                        <Label>Hora final</Label>
                        <Input
                          type="time"
                          className="mt-2"
                          value={productHours.hourEnd}
                          onChange={(e) => {
                            setProductHours((prev) => ({
                              ...prev,
                              hourEnd: e.target.value,
                            }));
                            setFormErrors((prev) => ({ ...prev, hourEnd: "" }));
                          }}
                        />
                        {formErrors.hourEnd && (
                          <span className="text-red-500 text-xs mt-1 block">
                            {formErrors.hourEnd}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="my-5">
                      <div className="mb-3">
                        <Label>Live vinculada</Label>
                      </div>

                      <Select
                        defaultValue={liveList[0]?._id}
                        value={liveVinculateId}
                        onValueChange={async (e) => {
                          const actualLive = liveList.find(
                            (item) => item._id == e
                          );
                          setLiveVinculateId(actualLive?._id ?? "");
                          setFormErrors((prev) => ({
                            ...prev,
                            liveVinculateId: "",
                          }));
                        }}
                      >
                        <SelectTrigger className=" w-full">
                          <SelectValue placeholder="Escolha a live para ser vinculada ao produto" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {liveList?.map((item) => (
                            <SelectItem value={item._id}>
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.liveVinculateId && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formErrors.liveVinculateId}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="w-full flex justify-between items-center">
                  <Label>Estoque</Label>
                  <Input className="mt-2 w-3/12" value={"10"} readOnly />
                </div>
              </section>

              <div className="w-full flex gap-5 justify-end  mt-10">
                <Button onClick={onClose} variant="outline">
                  Cancelar
                </Button>

                <Button
                  disabled={loading}
                  onClick={() => {
                    let errors = {
                      liveVinculateId: "",
                      hourStart: "",
                      hourEnd: "",
                    };
                    let valid = true;
                    if (isProductLive) {
                      if (!liveVinculateId) {
                        errors.liveVinculateId = "Selecione uma live";
                        valid = false;
                      }
                      if (!productHours.hourStart) {
                        errors.hourStart = "Informe a hora inicial";
                        valid = false;
                      }
                      if (!productHours.hourEnd) {
                        errors.hourEnd = "Informe a hora final";
                        valid = false;
                      }
                    }
                    setFormErrors(errors);
                    if (!valid) return;
                    handleCreateProducts({
                      liveId: liveId ?? liveVinculateId,
                      newProduct: {
                        ...productObject,
                        hourStart: productHours.hourStart,
                        hourEnd: productHours.hourEnd,
                      },
                      isProductLive: isProductLive ?? false,
                    });
                  }}
                  className="bg-blue-500  "
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Salvar"}
                </Button>
              </div>
            </section>
          )}
          <SheetFooter>
            <SheetClose></SheetClose>
          </SheetFooter>
        </SheetContent>
      </form>
    </Sheet>
  );
};
