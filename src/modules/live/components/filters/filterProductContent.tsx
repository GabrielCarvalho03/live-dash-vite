import { ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Filter, Plus } from "lucide-react";
import { useLive } from "../../hooks/useLive";
import { useFilterProduct } from "../../hooks/usefilterProduct";
import { useCreateProductsDrawer } from "@/shared/hooks/useCreateProductsDrawer/useCreateProductsDrawer";
import { CreateProductsDrawer } from "@/shared/components/drawers/CreateProducts.drawer";

export const FilterProductContent = () => {
  const {
    searchProduct,
    LiveVinculateFilter,
    setLiveVinculateFilter,
    setSearchProduct,
    applyFilters,
    clearFilter,
  } = useFilterProduct();
  const {
    openModalCreateProducts,
    loadingCreateProducts,
    setOpenModalCreateProducts,
  } = useCreateProductsDrawer();
  const { liveList } = useLive();

  return (
    <main className="w-full flex justify-between items-center ">
      <div className="w-7/12 flex items-center gap-4 mt-4 flex-wrap">
        <Input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchProduct(e?.target?.value);
            applyFilters({
              search: e.target.value,
              liveLinculate: LiveVinculateFilter,
            });
          }}
          value={searchProduct}
          placeholder="Buscar produtos"
          className="flex-grow max-w-xs"
        />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>

        <Select
          value={LiveVinculateFilter}
          onValueChange={(value) => {
            setLiveVinculateFilter(value);
            applyFilters({
              search: searchProduct,
              liveLinculate: value,
            });
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Lives vinculadas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>{"Todas"}</SelectItem>
            {liveList?.map((live) => (
              <SelectItem value={live._id}>{live.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant={"outline"} onClick={() => clearFilter()}>
          Limpar filtros
        </Button>
      </div>
      <div className="w-5/12 flex items-center justify-end gap-4 mt-4 flex-wrap">
        <Button
          variant="outline"
          className="hover:bg-blue-500 hover:text-white "
          onClick={() => setOpenModalCreateProducts(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <CreateProductsDrawer
        loading={loadingCreateProducts}
        isOpen={openModalCreateProducts}
        isProductLive
        onClose={() => setOpenModalCreateProducts(false)}
      />
    </main>
  );
};
