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
  name: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  DayOfDate?: boolean;
};

export function Calender({ value, onChange, DayOfDate }: CalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <>
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
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              onChange?.(d);
            }}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      {DayOfDate && date && (
        <span className="ml-2 text-sm text-muted-foreground">
          {format(date, "EEEE", { locale: ptBR })}
        </span>
      )}
    </>
  );
}
