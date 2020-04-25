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