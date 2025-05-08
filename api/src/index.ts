import express,{Express} from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import router from './routes'

env.config();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is runnin on: ${PORT}`);
})