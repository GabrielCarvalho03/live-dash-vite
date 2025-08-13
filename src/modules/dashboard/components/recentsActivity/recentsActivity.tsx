import { useLive } from "@/modules/live/hooks/useLive";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import dayjs from "dayjs";
import { Clock, Tv } from "lucide-react";

export const RecentsActivity = () => {
  const { liveList } = useLive();

  const atividades = [
    {
      id: 1,
      titulo: "Live Tutorial OBS",
      data: "25/01/2024 às 14:00",
      status: "Finalizada",
    },
    {
      id: 2,
      titulo: "Live ReactJS Avançado",
      data: "01/07/2025 às 18:00",
      status: "Ao Vivo",
    },
    {
      id: 3,
      titulo: "Live de Setup",
      data: "05/07/2025 às 20:00",
      status: "Agendada",
    },
  ];
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Atividade Recente
        </Label>

        {liveList?.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <Tv className="w-5 h-5" />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item?.title}</span>
                <span className="text-xs text-muted-foreground">
                  {dayjs(item?.dayLive.date).format("DD/MM/YYYY [às] HH:mm")}
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={
                item.status === "live"
                  ? "border-red-500 text-red-600 bg-red-100"
                  : item.status === "scheduled"
                  ? "border-blue-500 text-blue-600 bg-blue-100"
                  : "border-gray-400 text-gray-600 bg-gray-100"
              }
            >
              {item.status === "live"
                ? "Ao Vivo"
                : item.status === "scheduled"
                ? "Agendada"
                : "Finalizada"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
