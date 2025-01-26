// src/app/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
// For persistence
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// RTK Query & other slices
import authReducer from '../features/auth/authSlice';
import messageReducer from '../features/message/messageSlice';
import notificationReducer from '../features/notification/notificationSlice';
import presenceReducer from '../features/presence/presenceSlice';
import { authApi } from '../features/auth/authApi';
import { userApi } from '../features/user/userApi';
import { tenantApi } from '../features/tenant/tenantApi';
import { subscriptionPlanApi } from '../features/subscriptionPlan/subscriptionPlanApi';
import { subscriptionApi } from '../features/subscription/subscriptionApi';
import { settingsApi } from '../features/settings/settingsApi';
import { blacklistApi } from '../features/blacklist/blacklistApi';
import { bookingApi } from '../features/booking/bookingApi';
import { eventApi } from '../features/event/eventApi';
import { timeSlotApi } from '../features/timeSlot/timeSlotApi';
import { staffApi } from '../features/staff/staffApi';
import { galleryApi } from '../features/gallery/galleryApi';
import { serviceApi } from '../features/service/serviceApi';
import { customerApi } from '../features/customer/customerApi';
import { chatApi } from '../features/chat/chatApi';
import { categoryApi } from '../features/category/categoryApi';
import { globalSettingsApi } from '../features/globalSettings/globalSettingsApi';
import { amenityApi } from '../features/amenity/amenityApi';
import { notificationSettingsApi } from '../features/notificationSettings/notificationSettings.serviceApi';
import { inventoryApi } from '../features/inventory/inventoryApi';
import { reorderRequestApi } from '../features/reorderRequests/reorderRequestApi';
import { safetyApi } from '../features/safety/safetyApi';
import { reviewApi } from '../features/review/reviewApi';
import { receiptApi } from '../features/receipt/receiptApi';

// 1) Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  notification: notificationReducer,
  presence: presenceReducer,

  // RTK Query
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [tenantApi.reducerPath]: tenantApi.reducer,
  [subscriptionPlanApi.reducerPath]: subscriptionPlanApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [blacklistApi.reducerPath]: blacklistApi.reducer,
  [bookingApi.reducerPath]: bookingApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [timeSlotApi.reducerPath]: timeSlotApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [galleryApi.reducerPath]: galleryApi.reducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [globalSettingsApi.reducerPath]: globalSettingsApi.reducer,
  [amenityApi.reducerPath]: amenityApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  [notificationSettingsApi.reducerPath]: notificationSettingsApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [reorderRequestApi.reducerPath]: reorderRequestApi.reducer,
  [safetyApi.reducerPath]: safetyApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [receiptApi.reducerPath]: receiptApi.reducer,
});

// 2) Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // persist only the auth slice
};

// 3) Wrap rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4) Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // needed so redux-persist doesn't fail
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      tenantApi.middleware,
      subscriptionPlanApi.middleware,
      settingsApi.middleware,
      blacklistApi.middleware,
      bookingApi.middleware,
      eventApi.middleware,
      timeSlotApi.middleware,
      staffApi.middleware,
      galleryApi.middleware,
      serviceApi.middleware,
      customerApi.middleware,
      chatApi.middleware,
      categoryApi.middleware,
      globalSettingsApi.middleware,
      amenityApi.middleware,
      subscriptionApi.middleware,
      notificationSettingsApi.middleware,
      inventoryApi.middleware,
      reorderRequestApi.middleware,
      safetyApi.middleware,
      reviewApi.middleware,
      receiptApi.middleware,
    ),
});

// 5) Create persistor object
export const persistor = persistStore(store);

// 6) Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
