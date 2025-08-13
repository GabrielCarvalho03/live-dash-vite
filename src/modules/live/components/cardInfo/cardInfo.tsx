import { Card, CardContent } from "@/shared/components/ui/card"
import { Tv } from "lucide-react"

export type CardInfoProps = {
  title: string;
  Icon?: React.ElementType;
  countTotal: number;
  className?: string;
  bgColor?: string;
};


export const CardInfo = ({title , Icon , countTotal,bgColor   , className}:CardInfoProps) =>{

    return(
         <Card className={`${bgColor ? bgColor : 'bg-red-100'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">{title}</p>
                <p className="text-2xl font-bold">{countTotal}</p>
              </div>
              {Icon && <Icon className={`${ className ? className : 'text-red-600'}  w-5 h-5`} /> }
            </div>
          </CardContent>
        </Card>
    )
}