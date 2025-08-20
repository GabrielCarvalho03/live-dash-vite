import { liveObject } from "@/modules/live/hooks/types";
import { ChangePessowrDataSchema } from "./ChangePasswordSchema";

type handleChangePasswordFirstAcessProps = {
  data: ChangePessowrDataSchema;
};

type handleDeleteLiveProps = {
  id: string;
  setActualLive: React.Dispatch<React.SetStateAction<liveObject | undefined>>;
};

type sendMessageProps = {
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  liveId: string;
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

export interface useChatProps {
  allMessages: any[];
  setAllMessages: React.Dispatch<React.SetStateAction<any[]>>;
  handleSendMessage: ({
    messageText,
    liveId,
    setMessageText,
  }: sendMessageProps) => Promise<void>;
}
