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

export const FilterLiveContent = () => {
  const {
    searchLive,
    dateFilter,
    statusFilterLive,
    setDateFilter,
    setSearchLive,
    setStatusFilterLive,
    applyFilters,
    clearFilter,
  } = useFilterLive();

  return (
    <>
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <Input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchLive(e?.target?.value);
            applyFilters({
              search: e.target.value,
              status: statusFilterLive,
              date: dateFilter,
            });
          }}
          value={searchLive}
          placeholder="Buscar lives..."
          className="flex-grow max-w-xs"
        />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>
        <Select
          value={statusFilterLive}
          onValueChange={(value) => {
            setStatusFilterLive(value);
            applyFilters({
              search: searchLive,
              status: value,
              date: dateFilter,
            });
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="live">Ao vivo</SelectItem>
            <SelectItem value="finished">Finalizado</SelectItem>
          </SelectContent>
        </Select>

        <Calender
          value={dateFilter}
          name="Date"
          onChange={(e) => {
            setDateFilter(e);

            applyFilters({
              search: searchLive,
              status: statusFilterLive,
              date: e,
            });
          }}
        />

        <Button variant={"outline"} onClick={() => clearFilter()}>
          Limpar filtros
        </Button>
      </div>
    </>
  );
};
