# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.13. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

```bash
{
    "workflow" : {
        "workflowId":"wf-123",
        "steps" :[
            {"id" :"A" , "prompt":"what is todays date"},
            {"id" :"B" , "prompt":"what is 2+2" ,"dependendsOn" :["A"]},
            {"id" :"C" , "prompt":"what is 2*2" ,"dependendsOn" :["A"]},
            {"id" :"D" , "prompt":"what is 2+5" ,"dependendsOn" :["A"]},
            {"id" :"E" , "prompt":"Who is us precident" ,"dependendsOn" :["B","C","D"]}
        ]
    }
}
```

this is an example body of DAG that we are resolving the the code
