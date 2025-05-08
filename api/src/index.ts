import express,{Express} from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import router from './routes'
import { DatabaseConfig } from './config/db';

env.config();

const app: Express = express();
const DbConfig = DatabaseConfig.getInstance();

DbConfig.initializeDatabase()
  .then(() => {
    console.log("Database connected successfully");
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(router);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is runnin on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

