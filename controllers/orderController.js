import Order from '../models/OrderModel.js'

const addOrderItems = (async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body
  
    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: "No Order Items" });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
  
      const createdOrder = await order.save()
  
      res.status(200).json(createdOrder)
    }
  })
  export{addOrderItems}