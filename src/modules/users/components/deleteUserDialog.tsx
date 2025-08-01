import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useUser } from "../hooks/useUser";
import { Loader2 } from "lucide-react";

type DeleteUserDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteUserDialog = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteUserDialogProps) => {
  const { deleteUserisLoading } = useUser();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 -inset-y-10 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="w-[400px] h-[160px] shadow-lg border-none bg-white z-10 ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold   ">
            Tem certeza que deseja apagar esse usuário ?
          </CardTitle>
          <CardDescription>Esta ação não poderá ser desfeita.</CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button
            disabled={deleteUserisLoading}
            variant="default"
            className="bg-red-500"
            onClick={() => onDelete()}
          >
            {deleteUserisLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Excluir"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
