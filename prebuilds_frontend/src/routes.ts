export const routes = {
  product: (product_id: number, product_name: string) =>
    "/p/" + product_id + "-" + product_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, ""),
};