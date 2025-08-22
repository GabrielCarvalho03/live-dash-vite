import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { useState } from "react";
import { useLive } from "@/modules/live/hooks/useLive";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { Loader2 } from "lucide-react";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProductVinculationModal = ({ isOpen }: CreateUserFormProps) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("");
  const { liveEditObject } = useLive();
  const { loadingVinculationProduct, handleAddVinculationProduct } =
    useVinculationProductsLive();

  if (!isOpen) return null;

  return <h1>ola mundo</h1>;
};
