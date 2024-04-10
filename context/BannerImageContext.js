import _ from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';

const VariationContext = createContext();

export const VariationProvider = ({ children }) => {
  const [variation, setVariation] = useState(null);

  const setVariations = (variations) => {
    setVariation(variations);
  };

  useEffect(() => {
    const defaultVariant = _.filter(variation, (o) => o.is_default);
    setVariation(defaultVariant?.[0]);
  }, [variation]);

  return (
    <VariationContext.Provider value={{ setVariations, variation }}>
      {children}
    </VariationContext.Provider>
  );
};

export const useVariation = () => {
  return useContext(VariationContext);
};
