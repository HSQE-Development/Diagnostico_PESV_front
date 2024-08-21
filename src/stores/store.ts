import { corporateGroupService } from "./services/corporateGroupService";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { authService } from "./services/authService";
import sidebarReducer from "@/stores/features/sideBarSlice";
import companyReducer from "@/stores/features/companySlice";
import segmentReducer from "@/stores/features/segmentSlice";
import { companyService } from "./services/companyService";
import { segmentService } from "./services/segmentServices";
import { userService } from "./services/userService";
import vehicleQuestionSlideReducer from "@/stores/features/vehicleQuestionsSlice";
import driverQuestionSlideReducer from "@/stores/features/driverQuestionSlice";
import corporateGroupReducer from "@/stores/features/corporateGroupSlice";
import utilsReducer from "@/stores/features/utilsSlice";
import diagnosisReducer from "@/stores/features/diagnosisSlice";
import { diagnosisService } from "./services/diagnosisServices";
import arlReducer from "@/stores/features/arlSlice";
import { arlService } from "./services/arlService";

const createNoobStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoobStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  sidebarState: sidebarReducer,
  company: companyReducer,
  segment: segmentReducer,
  vehicleQuestion: vehicleQuestionSlideReducer,
  driverQuestion: driverQuestionSlideReducer,
  util: utilsReducer,
  diagnosis: diagnosisReducer,
  arls: arlReducer,
  corporateGroups: corporateGroupReducer,
  [authService.reducerPath]: authService.reducer,
  [companyService.reducerPath]: companyService.reducer,
  [segmentService.reducerPath]: segmentService.reducer,
  [userService.reducerPath]: userService.reducer,
  [diagnosisService.reducerPath]: diagnosisService.reducer,
  [arlService.reducerPath]: arlService.reducer,
  [corporateGroupService.reducerPath]: corporateGroupService.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "sidebar",
    "companies",
    "segments",
    "vehicleQuestions",
    "driverQuestions",
    "util",
    "arls",
    "corporateGroups",
    // "diagnosis",
  ], // Nombre del slice que quieres persistir
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authService.middleware,
      companyService.middleware,
      segmentService.middleware,
      userService.middleware,
      diagnosisService.middleware,
      arlService.middleware,
      corporateGroupService.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
