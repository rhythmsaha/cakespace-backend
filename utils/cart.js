exports.fetchCart = async (cartModel, userId, populate = false) => {
  if (populate) {
    let cart = await cartModel.findOne({ user: userId }).populate("items.product");
    return cart;
  } else {
    let cart = await cartModel.findOne({ user: userId });
    return cart;
  }
};

exports.emptyCart = async (cartModel, userId) => {
  let cart = await fetchCart(cartModel, userId);

  cart.items = [];
  cart.totalQuantity = 0;
  cart.totalAmount = 0;

  const _emptyCart = await cart.save();
  return _emptyCart;
};
