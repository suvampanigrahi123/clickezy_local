import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import * as api from '../services/storeService';
const useSelectVariants = (productDetails) => {
  const router = useRouter();
  const [defaultVariants, setDefaultVariants] = useState(null);
  const [otherVariants, setOtherVariants] = useState(null);
  const [generatedImage, setGeneratedImage] = useState([]);
  const query = router.query;
  useEffect(() => {
    if (query?.vId && productDetails?.variation && !query?.temp) {
      const updatedVariants = productDetails.variation.map((variant) => {
        return {
          ...variant,
          isSelected: variant.variation_id === Number(query.vId),
        };
      });
      setOtherVariants(updatedVariants);
      const selectedVariant = updatedVariants.find((o) => o.isSelected);
      if (selectedVariant) {
        setDefaultVariants(selectedVariant);
      }
    } else if (productDetails?.variation) {
      const updatedVariants = productDetails.variation.map((variant) => {
        return {
          ...variant,
          isSelected: variant.is_default,
        };
      });
      setOtherVariants(updatedVariants);
      const selectedVariant = updatedVariants.find((o) => o.isSelected);
      if (selectedVariant) {
        setDefaultVariants(selectedVariant);
      }
    }

    if (query?.vId && query?.temp) {
      const selectedVariantId = defaultVariants?.variation_id;
      const templateId = query?.temp;
      if (selectedVariantId && templateId) {
        setGeneratedImage([]);
        otherVariants?.forEach(async (element) => {
          if (element.variation_id === Number(query.vId)) {
            return;
          } else {
            const generatedImage = await fetchData(
              element?.variation_id,
              templateId,
              element
            );
            setGeneratedImage((prevState) => [...prevState, generatedImage]);
          }
        });
      }
    }

    async function fetchData(selectedVariantId, templateId, variant) {
      try {
        const res = await api.generateVariationBannerImage({
          selectedVariantId,
          templateId,
        });
        if (res) {
          return res;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [query?.vId, query?.temp, productDetails]);

  return {
    defaultVariants,
    otherVariants,
    generatedImage,
  };
};

export default useSelectVariants;
