import React, { createContext, useContext, useState } from 'react';

interface PurchaseRequestContextType {
  purchaseRequests: any[];
  setPurchaseRequests: React.Dispatch<React.SetStateAction<any[]>>;
}

export const PurchaseRequestContext = createContext<PurchaseRequestContextType>({
  purchaseRequests: [],
  setPurchaseRequests: () => {},
});

export const PurchaseRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([]);

  return (
    <PurchaseRequestContext.Provider value={{ purchaseRequests, setPurchaseRequests }}>
      {children}
    </PurchaseRequestContext.Provider>
  );
};

export const usePurchaseRequest = (): PurchaseRequestContextType => useContext(PurchaseRequestContext);