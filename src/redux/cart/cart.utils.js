export const addItemTocart = (cartItems, cartItemToAdd) => {

    //Check if item exist in array
    const existingCartItem = cartItems.find(
        cartItem => cartItem.id === cartItemToAdd.id
    );
   

        
    //Will return a new array modified on duplicate items
    if(existingCartItem){
        return cartItems.map(cartItem => 
            
            cartItem.id === cartItemToAdd.id 
            ? {...cartItem, quantity: cartItem.quantity  + 1}
            : cartItem
        )
    }

    //If item doesn't exist yet
    return [...cartItems, {...cartItemToAdd, quantity: 1} ]
};

export  const removeItemFromCart = (cartItems, cartItemToRemove) => {

    const existingCartItem = cartItems.find(
        cartItem => cartItem.id === cartItemToRemove.id
    );

    //If last one
    if(existingCartItem.quantity === 1){
        return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id)
    }

    return cartItems.map(
        cartItem =>
        cartItem.id === cartItemToRemove.id ?
        {...cartItem, quantity : cartItem.quantity -1}
        :
        cartItem
    )

};