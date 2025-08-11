import { Badge } from "@/shared/components/ui/badge";

type StatusLiveProps = {
  status: string;
};

export const StatusLive = ({ status }: StatusLiveProps) => {
  return (
    <Badge
      className={
        status === "live"
          ? "bg-red-500 text-white"
          : status === "scheduled"
          ? "bg-blue-500 text-white"
          : status === "finished"
          ? "bg-blue-950 text-white"
          : "bg-green-500 text-white"
      }
    >
      {status === "live"
        ? "AO VIVO"
        : status === "scheduled"
        ? "Agendada"
        : status === "finished"
        ? "Finalizada"
        : status}
    </Badge>
  );
};
