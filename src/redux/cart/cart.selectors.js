import { createSelector } from 'reselect';

const selectCart = state => state.cart;

//Memoized selector will return the carItems
export const selectCartItems = createSelector(
    [selectCart],//from this
    cart => cart.cartItems //what you want
);

//return if cart is hiden
export const selectCartHidden = createSelector(
    [selectCart],
    (cart) => cart.hidden
)


//Memoized number of items
export const selectCartItemsCount  = createSelector(
    [selectCartItems],
    cartItems => cartItems.reduce(
        (accumaltedQuantity, cartItem) =>
        accumaltedQuantity + cartItem.quantity,
        0
    )
)

//Total price
export const selectCartTotal = createSelector(
    [selectCartItems],
    cartItems => cartItems.reduce(
        (accumaltedQuantity, cartItem) =>
        accumaltedQuantity + cartItem.quantity * cartItem.price ,
        0
    )
)