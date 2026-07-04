import {createSlice} from "@reduxjs/toolkit";

// A cart line is identified by product id + selected size, so the same
// product in two sizes becomes two separate lines.
const makeCartKey = (id, size) => `${id}::${size || "one-size"}`;

const persist = (items) =>
    localStorage.setItem("cartItems", JSON.stringify(items));

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
            const cartKey = makeCartKey(item._id, item.size);
            const existingItem = state.cartItems.find((i) => i.cartKey === cartKey);
            if (existingItem) {
                existingItem.quantity += qty;
            } else {
                state.cartItems.push({...item, cartKey, quantity: qty});
            }
            persist(state.cartItems);
        },
        decreaseQty: (state, action) => {
            const cartKey = action.payload;
            const existingItem = state.cartItems.find((i) => i.cartKey === cartKey);
            if (existingItem) {
                existingItem.quantity -= 1;
                if (existingItem.quantity <= 0) {
                    state.cartItems = state.cartItems.filter((i) => i.cartKey !== cartKey);
                }
            }
            persist(state.cartItems);
        },
        removeFromCart: (state, action) => {
            const cartKey = action.payload;
            state.cartItems = state.cartItems.filter((i) => i.cartKey !== cartKey);
            persist(state.cartItems);
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
    },
});

export const {addToCart, decreaseQty, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;
