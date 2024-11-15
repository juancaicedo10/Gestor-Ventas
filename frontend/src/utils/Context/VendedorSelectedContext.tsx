import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface VendedorContextType {
    VendedorSelectedContext: number;
    setVendedorSelectedContext: React.Dispatch<React.SetStateAction<number>>;
}

const VendedorContext = createContext<VendedorContextType | undefined>(undefined);

export const VendedorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [VendedorSelectedContext, setVendedorSelectedContext] = useState<number>(0);

    return (
        <VendedorContext.Provider value={{ VendedorSelectedContext, setVendedorSelectedContext }}>
            {children}
        </VendedorContext.Provider>
    );
};

export const useVendedorContext = () => {
    const context = useContext(VendedorContext);
    if (context === undefined) {
        throw new Error('context not found');
    }
    return context;
};