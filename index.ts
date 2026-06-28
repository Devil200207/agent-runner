import express from "express";
import {z} from "zod";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!
// });

import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: { Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY },
})

const app = express();

app.use(express.json());

const StepGraph = z.array(z.object({
    id: z.string(),
    prompt: z.string(),
    dependendsOn: z.array(z.string()).optional()
}))

type StepGrpahtType = z.infer<typeof StepGraph>;



const CreatWorkflowSchema = z.object({
    workflowId: z.string(),
    steps: StepGraph
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

    const result = await resolveGraph(data.steps);
    res.json({
        result
    })
})

function resolveGraph(graph:StepGrpahtType):Promise<{result:string,id:string}[]> {
    return new Promise(async (resolve) => {
        if(!graph.length)
        {
            resolve([])
            return;
        }
        const canResolveGraph = graph.filter(x => !x.dependendsOn || x.dependendsOn.length == 0);
        const promic = canResolveGraph.map(node => runAgent(node.prompt));
        const result = await Promise.all(promic);
        graph = graph.map(g =>{
            if(g.dependendsOn)
            {
                return {
                    ...g,
                    dependendsOn: g.dependendsOn.filter(id => !canResolveGraph.map(x => x.id).includes(id))
                }
            }
            else{
                return g
            }
        }).filter(node => !canResolveGraph.map(x => x.id).includes(node.id))

        resolve([...result.map((r,index) => ({
            result:r.result!,
            id:canResolveGraph[index]?.id!
        })),...await resolveGraph(graph)])
    })

}

function runAgent(prompt:string):Promise<{result:string}> {
    console.log("run prompt " + prompt)
    return new Promise(async (resolve) =>{
        const response = await ollama.chat({
            model: 'gpt-oss:120b',
            messages: [{ role: 'user', content: prompt }],
          })

        resolve({
            result:response.message.content!
        })
    })
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});