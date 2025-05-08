import express, {Request, Response, Router} from "express";

const router: Router = express.Router();

router.get("/tasks", (req:Request, res:Response) => {
  res.status(200).send("OK");
});

router.get("/tasks/:id", (req:Request, res:Response) => {
  const id = parseInt(req.params.id);
});

router.post("/tasks", (req:Request, res:Response) => {
  //
});

router.put("/tasks/:id", (req:Request, res:Response) =>{
  const id = parseInt(req.params.id);
});

router.delete("/tasks/:id", (req:Request, res:Response) =>{
  const id = parseInt(req.params.id);
});

export default router;