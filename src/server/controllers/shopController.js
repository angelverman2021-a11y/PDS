import { getRegisteredFpsShops, searchShopsByPincode } from '../../services/shopService';

export const ShopController = {
  listRegistered() {
    return { status: 200, body: { shops: getRegisteredFpsShops() } };
  },

  search({ query }) {
    const result = searchShopsByPincode({
      pincode: query.pincode,
      userLocation: query.lat && query.lng
        ? { latitude: Number(query.lat), longitude: Number(query.lng) }
        : undefined,
    });

    return {
      status: result.ok ? 200 : 400,
      body: result,
    };
  },

  getById({ params }) {
    const shop = getRegisteredFpsShops().find(item => item.fpsId === params.fpsId || item.id === params.fpsId);
    return shop
      ? { status: 200, body: { shop } }
      : { status: 404, body: { error: 'SHOP_NOT_FOUND' } };
  },
};
