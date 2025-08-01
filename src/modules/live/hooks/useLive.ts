import { create } from 'zustand';
import { LiveRegisterType } from './types';
import { toast } from 'sonner';
export const useLive = create<LiveRegisterType>(set => ({
    modalCreateLiveIsOpen: false,
    setModalCreateLiveIsOpen: value => set({ modalCreateLiveIsOpen: value }),

    handleOpenCreateLiveModal: () => {
        console.log('Abrindo modal');
        const { setModalCreateLiveIsOpen } = useLive.getState();
        setModalCreateLiveIsOpen(true);
    },
}));
