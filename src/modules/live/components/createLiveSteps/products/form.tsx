import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

import { VinculationProductsLiveSchemaData } from "@/modules/live/hooks/vinculationProductsLiveSchema";
import { useState } from "react";
import { useLive } from "@/modules/live/hooks/useLive";
import { useVinculationProductsLive } from "@/modules/live/hooks/useVinculationProducts";
import { Loader2 } from "lucide-react";

type CreateUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProductVinculationModal = ({
  isOpen,
  onClose,
}: CreateUserFormProps) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("");
  const { liveEditObject } = useLive();
  const { loadingVinculationProduct, handleAddVinculationProduct } =
    useVinculationProductsLive();

  const onSubmit = (data: VinculationProductsLiveSchemaData) => {
    handleAddVinculationProduct(data);
  };

  if (!isOpen) return null;

  return <h1>ola mundo</h1>;
};
