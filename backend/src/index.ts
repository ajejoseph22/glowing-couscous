import express, { urlencoded } from "express";
import cors from "cors";
import dashboardRoute from "./routes/dashboard";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));

app.use("/dashboard", dashboardRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App successfully started on port ${port} `);
});

export default app;
