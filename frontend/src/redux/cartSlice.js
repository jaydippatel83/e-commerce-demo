import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const qty = item.quantity || 1;
            const existingItem = state.cartItems.find((i) => i._id === item._id);
            if (existingItem) {
                existingItem.quantity += qty;
            } else {
                state.cartItems.push({...item, quantity: qty});
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        decreaseQty: (state, action) => {
            const itemId = action.payload;
            const existingItem = state.cartItems.find((i) => i._id === itemId);
            if (existingItem) {
                existingItem.quantity -= 1;
                if (existingItem.quantity <= 0) {
                    state.cartItems = state.cartItems.filter((i) => i._id !== itemId);
                }
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((i) => i._id !== itemId);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
    },
});

export const {addToCart, decreaseQty, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;