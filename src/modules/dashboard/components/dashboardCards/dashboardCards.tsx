import { Clock, Eye, Tv, Users } from "lucide-react";
import { CardComponent } from "../card/card";
import { useLive } from "@/modules/live/hooks/useLive";

export const DashboardCards = () => {
  const { liveList } = useLive();

  const livesAtivas = liveList?.filter((item) => item.status == "live");
  const livesAgendadas = liveList?.filter((item) => item.status == "scheduled");
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
      <CardComponent
        title="Lives Ativas"
        description="transmitindo agora"
        countTotal={livesAtivas.length}
        Icon={Tv}
        countNow={livesAtivas.length}
      />

      <CardComponent
        title="Lives Agendadas"
        description="próximas lives"
        countTotal={livesAgendadas.length}
        Icon={Clock}
        countNow={livesAgendadas.length}
        className="bg-blue-100 text-blue-500"
      />

      <CardComponent
        title="Total de Visualizações"
        description="   Todas as lives"
        countTotal={livesAgendadas.length}
        Icon={Eye}
        countNow={livesAgendadas.length}
        className="bg-green-100 text-green-500"
      />

      <CardComponent
        title="Usuários Ativos"
        description=" Total"
        countTotal={0}
        Icon={Users}
        countNow={0}
        className="bg-purple-100 text-purple-500"
      />
    </main>
  );
};
