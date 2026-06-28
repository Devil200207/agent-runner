import express from "express";
import {z} from "zod";

const app = express();

app.use(express.json());

const CreatWorkflowSchema = z.object({
    workflowId: z.string(),
    steps: z.array(z.object({
        id: z.string(),
        prompt: z.string()
    }))
})

const CreateWorkflowResponce = z.object({
    message: z.string(),
    results : z.object({
        id: z.string(),
        result: z.string()
    })
})

app.post("/workflow",async(req,res) =>{
    const workflow = req.body.workflow;
    const {success,data} = CreatWorkflowSchema.safeParse(workflow);
    if(!success)
    {
        res.status(411).json({
            message:"Invalid Input"
        });

        return;
    }
})

function runAgent(prompt:string):Promise<{result:string}> {
    const result =  new Promise((resolve,reject) => {
        
    });

    return {result};
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});