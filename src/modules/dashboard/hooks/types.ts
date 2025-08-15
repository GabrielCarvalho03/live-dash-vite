import { liveObject } from "@/modules/live/hooks/types";
import { ChangePessowrDataSchema } from "./ChangePasswordSchema";

type handleChangePasswordFirstAcessProps = {
  data: ChangePessowrDataSchema;
};

type handleDeleteLiveProps = {
  id: string;
  setActualLive: React.Dispatch<React.SetStateAction<liveObject | undefined>>;
};

export interface useDashboardProps {
  changePasswordIsLoading: boolean;
  setChangePasswordIsLoading: (value: boolean) => void;

  ChangePasswordFristAcessModal: boolean;
  SetChangePasswordFristAcessModal: (value: boolean) => void;

  handleChangePasswordFirstAcess: ({
    data,
  }: handleChangePasswordFirstAcessProps) => Promise<void>;

  openDeleteLiveModal: boolean;
  setOpenDeleteLiveModal: (value: boolean) => void;

  deleteLiveISLoading: boolean;
  setDeleteLiveISLoading: (value: boolean) => void;
  handleDeleteLive: ({
    id,
    setActualLive,
  }: handleDeleteLiveProps) => Promise<void>;
}
