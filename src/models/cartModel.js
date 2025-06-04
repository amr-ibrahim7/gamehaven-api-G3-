/*
cartItem schema :
game: id to the game that added to the cart (ref game)  required (like foreign key)
quantity: number   required  

cartSchema:
user: id  to the user that own the care (ref user) required unique (like foreign key)
items : [cartItem schema ]=> the schema which we added above
total price: Number  required

*/