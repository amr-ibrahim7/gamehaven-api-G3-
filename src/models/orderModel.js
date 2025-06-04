/*
orderItem schema:
game: id to the game that was ordered (ref Game) required (like foreign key)
quantity: number required
price: number required (price of the game at the time of purchase)

orderSchema:
user: id to the user who placed the order (ref User) required (like foreign key)
items: [orderItem schema] => the schema defined above for each item in the order
totalPrice: Number required
status: String (enum: ['pending', 'completed', 'cancelled']) default: 'pending'
orderedAt: Date (default: current date/time)


*/