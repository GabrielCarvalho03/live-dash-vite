import { create } from "zustand";
import { useFilterProductsProps } from "./types";
import dayjs from "dayjs";
import { useVinculationProductsLive } from "./useVinculationProducts";

export const useFilterProduct = create<useFilterProductsProps>((set) => ({
  searchProduct: "",
  setSearchProduct: (searchProduct) => set({ searchProduct }),
  statusFilterProduct: "",
  setStatusFilterProduct: (statusFilterProduct) => set({ statusFilterProduct }),
  LiveVinculateFilter: "",
  setLiveVinculateFilter: (LiveVinculateFilter) => set({ LiveVinculateFilter }),
  applyFilters: ({ search, liveLinculate }) => {
    const { allVinculationProducts, setAllViculationProductsFiltered } =
      useVinculationProductsLive.getState();

    let filtered = allVinculationProducts;

    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (liveLinculate) {
      filtered = filtered.filter((item) => item.liveId == liveLinculate);
    }

    if (liveLinculate && liveLinculate == "all") {
      setAllViculationProductsFiltered(allVinculationProducts);
      return;
    }

    setAllViculationProductsFiltered(filtered);
  },
  clearFilter: () => {
    const { setLiveVinculateFilter, setSearchProduct, setStatusFilterProduct } =
      useFilterProduct.getState();
    const {
      allVinculationProducts,
      setAllViculationProducts,
      setAllViculationProductsFiltered,
    } = useVinculationProductsLive.getState();
    setLiveVinculateFilter("all");
    setSearchProduct("");
    setStatusFilterProduct("all");

    setAllViculationProductsFiltered(allVinculationProducts);
  },
}));
