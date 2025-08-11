import { ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/components/ui/select";
import { Calender } from "../calendar/calendar";
import { Input } from "@/shared/components/ui/input";
import { Filter } from "lucide-react";
import { useFilterLive } from "../../hooks/usefilterLive";
import { useLive } from "../../hooks/useLive";
import { useFilterProduct } from "../../hooks/usefilterProduct";

export const FilterProductContent = () => {
  const {
    searchProduct,
    statusFilterProduct,
    LiveVinculateFilter,
    setLiveVinculateFilter,
    setSearchProduct,
    setStatusFilterProduct,
    applyFilters,
    clearFilter,
  } = useFilterProduct();
  const { liveList } = useLive();

  return (
    <>
      <div className="flex items-center gap-4 mt-4 flex-wrap">
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
    </>
  );
};
