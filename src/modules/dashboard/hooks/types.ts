import { ChangePessowrDataSchema } from "./ChangePasswordSchema";

type handleChangePasswordFirstAcessProps = {
  data: ChangePessowrDataSchema;
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
  handleDeleteLive: (id: string) => Promise<void>;
}
