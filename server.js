const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const authenticationRoute = require("./routes/authentication.routes");
const categoriesRoute = require("./routes/categories.routes");
const subcategoriesRoute = require("./routes/subcategories.routes");
const flavoursRoute = require("./routes/flavours.routes");
const productsRoute = require("./routes/products.routes");
const cartRoute = require("./routes/cart.routes");
const checkoutRoute = require("./routes/checkout.routes");

dotenv.config();
connectDB();

// common middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/auth", authenticationRoute);
app.use("/categories", categoriesRoute);
app.use("/subcategories", subcategoriesRoute);
app.use("/flavours", flavoursRoute);
app.use("/flavours", flavoursRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoute);

app.use(notFound);
app.use(errorHandler);

// Listening to port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
