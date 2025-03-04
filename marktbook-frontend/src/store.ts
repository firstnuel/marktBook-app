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

const posPersistConfig = {
  key: 'pos',
  storage,
  whitelist: ['cartItems']
}

// the base reducer combination
const combinedReducer = combineReducers({
  'auth': persistReducer(authPersistConfig, authReducer),
  'pos': persistReducer(posPersistConfig, posReducer),
  'inv': invReducer
})

// root reducer with reset capability
const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === RESET_ALL) {
    // This will reset all reducers to their initial state
    state = undefined
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