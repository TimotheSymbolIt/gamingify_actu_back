require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
// middlewares
const notFound = require("./middlewares/notFoundMiddleware.js");
const errorHandler = require("./middlewares/errorHandlerMiddleware.js");
const cors = require("cors");

// routers
const authRouter = require("./routes/authRoutes.js");
const articlesRouter = require("./routes/articlesRoutes.js");
const commentaryRouter = require("./routes/commentaryRoutes.js");
const userRouter = require("./routes/userRoutes.js");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/commentary", commentaryRouter);
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);

const port = 5000;
app.listen(port, () => console.log(`Server is listening on ${port}...`));
