// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Custom hook: useAppDispatch
 * Returns a typed dispatch function (AppDispatch).
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook: useAppSelector
 * Returns a typed selector function for your RootState.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
