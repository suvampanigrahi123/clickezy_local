export const calculateShippingPrice = (priceList, weight, quality) => {
  if (priceList && priceList !== '') {
    const eachPriceData = priceList.split(',');

    if (eachPriceData.length > 0) {
      const priceDetails = eachPriceData.map((p) => p.split(':'));

      if (priceDetails && priceDetails.length > 0) {
        let p;
        if (weight <= 0.5) {
          p = parseFloat(priceDetails[0][1]);
        } else if (weight <= 1) {
          p = parseFloat(priceDetails[1][1]);
        } else if (weight <= 2) {
          p = parseFloat(priceDetails[2][1]);
        } else if (weight <= 3) {
          p = parseFloat(priceDetails[3][1]);
        } else if (weight <= 4) {
          p = parseFloat(priceDetails[4][1]);
        } else if (weight <= 5) {
          p = parseFloat(priceDetails[5][1]);
        } else {
          p = parseFloat(priceDetails[6][1]);
        }
        if (!isNaN(p)) {
          return p * quality || 0;
        }
      }
    }
  }

  return 0;
};
