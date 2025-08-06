import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice/index";
import commonFeatureSlice from "./common-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import adminOrderSlice from "./admin/order-slice";
import shopReviewSlice from "./shop/review-slice";
import shopSearchSlice from "./shop/search-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductsSlice,
    shopProducts: shopProductsSlice,
    shopAddress: shopAddressSlice,
    adminOrder: adminOrderSlice,

    shopSearch: shopSearchSlice,
    shopCart: shopCartSlice,
    commonFeature: commonFeatureSlice,
    shopOrder: shopOrderSlice,
    shopReview: shopReviewSlice,
  },
});

export default store;
