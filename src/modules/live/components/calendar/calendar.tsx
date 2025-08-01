"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { UseFormRegister } from "react-hook-form";
import { LiveCreateSchemaData } from "../../hooks/liveCreateSchema";

type CalendarProps = {
  defaultDate?: Date;
  name: string;
  register: UseFormRegister<LiveCreateSchemaData>;
};

export function Calender({ defaultDate, name, register }: CalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  React.useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  return (
    <>
      <input
        type="hidden"
        value={date ? date.toISOString() : ""}
        {...register("date")}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: ptBR })
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </>
  );
}
