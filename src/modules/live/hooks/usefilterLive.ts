import { create } from "zustand";
import { useFilterLiveProps } from "./types";
import { useLive } from "./useLive";
import dayjs from "dayjs";

export const useFilterLive = create<useFilterLiveProps>((set) => ({
  searchLive: "",
  setSearchLive: (searchLive) => set({ searchLive }),
  statusFilterLive: "",
  setStatusFilterLive: (statusFilterLive) => set({ statusFilterLive }),
  dateFilter: undefined,
  setDateFilter: (dateFilter) => set({ dateFilter }),
  applyFilters: ({ search, status, date }) => {
    const { liveList, setLiveListFilter } = useLive.getState();

    let filtered = liveList;

    if (status && status !== "all") {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter(
        (item) =>
          dayjs(item.dayLive.date).format("YYYY-MM-DD") ===
          dayjs(date).format("YYYY-MM-DD")
      );
    }

    setLiveListFilter(filtered);
  },

  clearFilter: () => {
    const { setDateFilter, setSearchLive, setStatusFilterLive } =
      useFilterLive.getState();
    const { liveList, setLiveListFilter } = useLive.getState();
    setDateFilter(undefined);
    setSearchLive("");
    setStatusFilterLive("all");

    setLiveListFilter(liveList);
  },
}));
