'use client';
import { create } from 'zustand';

interface LeadFormData {
    service?: string;
    package?: string;
}

interface AppState {
    isLeadModalOpen: boolean;
    leadFormData: LeadFormData;
    openLeadModal: (data?: LeadFormData) => void;
    closeLeadModal: () => void;
    activeSection: string;
    setActiveSection: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isLeadModalOpen: false,
    leadFormData: {},
    openLeadModal: (data = {}) => set({ isLeadModalOpen: true, leadFormData: data }),
    closeLeadModal: () => set({ isLeadModalOpen: false, leadFormData: {} }),
    activeSection: '',
    setActiveSection: (id) => set({ activeSection: id }),
}));
