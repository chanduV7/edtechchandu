const { Router } = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paymentRouter = Router();

// const cart = {
//     items: [{price, qty,name}],
//     totalPrice, totalQty
// }

paymentRouter.post("/checkout", async (req, res) => {
  const data = await stripe.checkout.sessions.create({
    line_items: req.body.items.map(e => ({ // [{}]
        price_data: { 
            currency: "INR",
            product_data: {
                name: e.name,
                description: e.description,
                // images: [e.img]
            },
            unit_amount: e.price*100
        },
        quantity: e.qty,
      })),
    mode: "payment",
    success_url: `http://localhost:3001?success=true`,
    cancel_url: `http://localhost:3001?canceled=true`,
  });
  console.log(data);
  res.send(data);
});

module.exports = paymentRouter;
