import useSWR from 'swr';
import * as api from '../services/storeService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const useBannerImage = (
  selectedVariantId,
  templateId,
  isSystemGenerated,
  templateSubCategoryId
) => {
  const router = useRouter();
  const [dynamicBannerImage, setDynamicBannerImage] = useState(null);
  const {
    data: variationImage,
    isLoading,
    error,
  } = useSWR(
    isSystemGenerated &&
      templateId &&
      selectedVariantId && [
        ('/store/generate-image-for-variation', templateId, selectedVariantId),
      ],
    () => api.generateVariationBannerImage({ selectedVariantId, templateId })
  );

  // AI Generated Image
  const [AIFrameImages, setAIFrameImages] = useState(null);
  useEffect(() => {
    // call API
    const AIGeneratedImage = async () => {
      const res = await api.AiGeneratedVariationImage({
        selectedVariantId,
        templateSubCategoryId,
      });
      if (res) {
        setAIFrameImages(res);
      }
    };
    if (selectedVariantId && templateSubCategoryId) {
      AIGeneratedImage();
    }
  }, [selectedVariantId]);

  useEffect(() => {
    if (router.query.temp) {
      const findSelectedImage = AIFrameImages?.generated_images?.filter(
        (item) => item.template_id === router.query.temp
      );
      setDynamicBannerImage(
        findSelectedImage && findSelectedImage[0].template_image
      );
    } else if (variationImage) {
      setDynamicBannerImage(variationImage?.variation_image);
    }
  }, [router.query, selectedVariantId, variationImage]);
  return {
    dynamicBannerImage,
    AIFrameImages,
    isLoading,
    error,
  };
};

export default useBannerImage;
