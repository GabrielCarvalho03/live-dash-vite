import { Card, CardContent } from "@/shared/components/ui/card";
import { TrendingUp } from "lucide-react";

export type CardComponnentProps = {
  title: string;
  Icon?: React.ElementType;
  countTotal: number;
  countNow?: number;
  description: string;
  className?: string;
};

export const CardComponent = ({
  title,
  Icon,
  countNow,
  countTotal,
  description,
  className,
}: CardComponnentProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center w-full">
          <div
            className={`${
              className ? className : "bg-red-100 text-red-500"
            } p-2 rounded-xl`}
          >
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div className="text-2xl font-bold">{countTotal}</div>
        </div>
        <p className="text-sm font-medium">{title}</p>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 " />
          <p className="text-xs text-muted-foreground">
            {countNow} {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
