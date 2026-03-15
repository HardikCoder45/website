'use client';
import { create } from 'zustand';

interface Product {
    id: string;
    name: string;
    category: string;
    startingPrice: number;
    description: string;
    tags: string[];
}

interface ProductState {
    isOpen: boolean;
    activeProduct: Product | null;
    openModal: (product: Product) => void;
    closeModal: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    isOpen: false,
    activeProduct: null,
    openModal: (product) => set({ isOpen: true, activeProduct: product }),
    closeModal: () => set({ isOpen: false, activeProduct: null }),
}));
