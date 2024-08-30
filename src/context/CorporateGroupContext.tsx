import React, { createContext, ReactNode, useContext, useState } from "react";

interface CorporateContextProps {
  corporateId?: number;
  setCorporateId: (id: number | undefined) => void;
}

// Crea el contexto con un valor por defecto
const CorporateContext = createContext<CorporateContextProps | undefined>(
  undefined
);

// Crea un proveedor de contexto
export const CorporateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [corporateId, setCorporateId] = useState<number | undefined>(undefined);

  return (
    <CorporateContext.Provider value={{ corporateId, setCorporateId }}>
      {children}
    </CorporateContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCorporate = () => {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error("useCorporate debe usarse dentro de un CorporateProvider");
  }
  return context;
};
