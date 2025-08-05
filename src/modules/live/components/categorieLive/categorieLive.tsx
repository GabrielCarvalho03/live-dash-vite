import { Badge } from "@/shared/components/ui/badge";
import { CategoryListCreateLive } from "../../utils/categoryList";

type CategorieLiveProps = {
  categorie: string;
};

export const CategorieLive = ({ categorie }: CategorieLiveProps) => {
  const findCategorie = CategoryListCreateLive?.find(
    (item) => item.title == categorie
  );

  return (
    <Badge className="bg-blue-950   ">
      {/*  */}

      <span className="pr-3">{findCategorie?.Icon}</span>

      <span className="">{findCategorie?.title}</span>
    </Badge>
  );
};
