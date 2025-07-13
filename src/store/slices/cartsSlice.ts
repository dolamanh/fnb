import { Cart } from "../../core/entities/Cart";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

export interface CartState {
    carts: Cart[];
    loading: boolean;
    error: string | null;
}

export const initialCartState: CartState = {
    carts: [],
    loading: false,
    error: null,
};

export const getCarts = createAsyncThunk(
    'carts/getCarts',
    async (_, { rejectWithValue }) => {
        try {
            const getCartsUseCase = container.get(TYPES.GetCartsUseCase) as any;
            const carts = await getCartsUseCase.execute();
            return carts;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch carts';
            console.error('Failed to fetch carts:', error);
            return rejectWithValue(errorMessage);
        }
    }
);

export const cartsSlice = createSlice({
    name: 'carts',
    initialState: initialCartState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetCarts: (state) => {
            state.carts = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCarts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCarts.fulfilled, (state, action) => {
                state.loading = false;
                state.carts = action.payload;
            })
            .addCase(getCarts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export const { clearError, resetCarts } = cartsSlice.actions;
export default cartsSlice.reducer;



