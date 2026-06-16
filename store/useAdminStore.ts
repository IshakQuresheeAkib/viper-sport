import { create } from "zustand";
import type { AdminStatusFilter, Registration } from "@/types";

type AdminState = {
  registrations: Registration[];
  searchTerm: string;
  statusFilter: AdminStatusFilter;
  setRegistrations: (data: Registration[]) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: AdminStatusFilter) => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  registrations: [],
  searchTerm: "",
  statusFilter: "all",
  setRegistrations: (data) => set({ registrations: data }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (filter) => set({ statusFilter: filter })
}));
