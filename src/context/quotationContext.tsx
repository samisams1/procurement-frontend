import React, { createContext, useContext, useState } from 'react';

interface QuotationContextType {
    quotations: any[];
    setQuotations: React.Dispatch<React.SetStateAction<any[]>>;
}

export const  QuotationContext = createContext<QuotationContextType>({
  quotations: [],
  setQuotations: () => {},
});

export const QuotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<any[]>([]);

  return (
    <QuotationContext.Provider value={{ quotations, setQuotations }}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = (): QuotationContextType => useContext(QuotationContext);