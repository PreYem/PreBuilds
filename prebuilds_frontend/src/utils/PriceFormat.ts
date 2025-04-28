export const PriceFormat = (price: number | string | undefined | null): string => {
    if (price === undefined || price === null) return "0.00";
    
    const priceFloat = typeof price === "number" ? price : Number(price);
    
    if (isNaN(priceFloat)) return "0.00";
    
    return priceFloat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };