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
import { Card, CardContent } from "../ui/card";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";

type createProductsDrawerProps = {
  liveId?: string;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
};

export const CreateProductsDrawer = ({
  liveId,
  isOpen,
  loading,
  onClose,
}: createProductsDrawerProps) => {
  const [productLinkInput, setProductLinkInput] = useState("");
  const {
    searchProductsIsLoading,
    productObject,
    getIdByLink,
    handleCreateProducts,
    handleGetProductById,
  } = useCreateProductsDrawer();

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
                getIdByLink(
                  "https://sampa.buscabusca.com.br/index.php?route=product/product&product_id=9980"
                );
                handleGetProductById("1344");
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
                  <Input className="mt-2" value={"R$ 500,00"} readOnly />
                </div>

                <div className="my-5">
                  <Label>Descrição</Label>
                  <Input
                    className="mt-2"
                    value={"Descrição do produto..."}
                    readOnly
                  />
                </div>

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
                  onClick={() =>
                    handleCreateProducts({
                      liveId: liveId ?? "",
                      newProduct: productObject,
                    })
                  }
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
