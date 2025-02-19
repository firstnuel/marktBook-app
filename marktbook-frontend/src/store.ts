import { configureStore, combineReducers, Action } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import posReducer from '@reducers/posReducers'
import authReducer from '@reducers/authReducer'
import invReducer from '@reducers/invReducer'
import businessReducer from '@reducers/businessReducer'
import contactsReducer from '@reducers/contactsReducer'

// Add RESET_ALL action type
export const RESET_ALL = 'RESET_ALL'

const authPersistConfig = {
  key: 'auth',
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_SECRET_KEY,
      onError: (error) => console.log('Encryption error', error)
    })
  ],
  whitelist: ['userToken', 'user'],
  blacklist: ['loading', 'error', 'registered', 'reset', 'updated']
}

const invPersistConfig = {
  key: 'inv',
  storage,
  whitelist: ['mainOpt', 'subOpt', 'product', 'productsByCat', 'stock' ]
}

const contactsPersistConfig = {
  key: 'contacts',
  storage,
  whitelist: ['mainOpt', 'subOpt', 'suppliers', 'contacts' ]
}

// the base reducer combination
const combinedReducer = combineReducers({
  'auth': persistReducer(authPersistConfig, authReducer),
  'pos': persistReducer({ key: 'pos', storage, whitelist: ['cartItems', 'customer'] }, posReducer),
  'business': persistReducer({ key: 'business', storage, whitelist: ['business'] }, businessReducer),
  'inv': persistReducer(invPersistConfig, invReducer),
  'contacts': persistReducer(contactsPersistConfig, contactsReducer)
})

// root reducer with reset capability
const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === RESET_ALL) {
    // This will reset all reducers to their initial state
    state = undefined
  }
  if (action.type === 'STORE_RESET') {
    combinedReducer(undefined, action)
  }
  return combinedReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
const persistor = persistStore(store)

export { store, persistor }

export type RootState = ReturnType<typeof combinedReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector