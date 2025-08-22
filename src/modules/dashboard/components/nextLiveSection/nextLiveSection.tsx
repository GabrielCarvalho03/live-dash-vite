import { useLive } from "@/modules/live/hooks/useLive";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { format } from "date-fns";
import dayjs from "dayjs";
import { Calendar, Clock2 } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/shared/components/ui/badge";

export const NextLiveSection = () => {
  const { liveList } = useLive();

  const livesAgendadas = liveList?.filter((item) => item.status == "scheduled");
  const NextLive = livesAgendadas?.sort((a, b) => {
    const aDate = dayjs(a.dayLive?.date).valueOf();
    const bDate = dayjs(b.dayLive?.date).valueOf();
    return aDate - bDate;
  });

  return (
    <Card className="shadow-sm w-full  mt-10 min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Próxima Live</CardTitle>
      </CardHeader>

      <CardContent className="w-full px-10 0">
        {NextLive?.map((item, index) => {
          return (
            <div key={item._id} className="flex flex-col">
              <div
                key={item._id}
                className="flex items-center justify-between border-b rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />

                      <span className="font-semibold text-base ">
                        {item.title}
                      </span>
                    </div>

                    <div className="fex gap-5">
                      <span className="font-normal text-gray-400 text-sm">
                        {format(item.dayLive.date, "d 'de' MMM yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {/* <span className="text-xs text-muted-foreground">
                                      {item.}
                                    </span> */}
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <Badge className="bg-blue-950   ">
                    {/*  */}

                    <span className="pr-3">
                      <Clock2 className="w-4 h-4" />
                    </span>

                    <span className="">{"Agendada"}</span>
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
