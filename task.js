const fs=require("fs");
let tasks=(fs.readFileSync("todos.json","utf-8"))
if(!tasks){
    tasks=[];
}else{
    tasks=JSON.parse(tasks);
}

let index;
let completeTasks;
let incompleteTasks;
let key;
let arguments = process.argv;
arguments.shift();
arguments.shift();
let argsData=arguments;


switch(arguments[0]){
    case 'add':
        argsData.shift();
        let data=argsData.join(" ");
        if(!data){
            console.log("Error: Missing tasks string. Nothing added!")
            break;
        }
        let [priority,...work]=data.split(" ");
        let todo=work.join(" ");
        let task={
            key:Date.now(),
            todo,
            priority,
            done:0
        }
        tasks.push(task);
        console.log(`Added task: "${todo}" with priority ${priority}`);
        tasks.sort(function(a, b){
            return a.priority - b.priority;
        });
        fs.writeFileSync("todos.json",JSON.stringify(tasks))
        break;

    case 'ls':
        incompleteTasks=tasks.filter((task)=>(task.done!==1));

        if(incompleteTasks.length===0){
            console.log("There are no pending tasks!")
            break;
        }

        for(let i=1;i<=incompleteTasks.length;i++){
            console.log(`${i}. ${incompleteTasks[i-1].todo} [${incompleteTasks[i-1].priority}]`)
        }
        break;

    case 'ls-c':
        completeTasks=tasks.filter((task)=>(task.done===1));

        for(let i=1;i<=completeTasks.length;i++){
            console.log(`${i}. ${completeTasks[i-1].todo} [${completeTasks[i-1].priority}]`)
        }
        break;

    case undefined:

    case 'help':
        console.log("Usage :-");
        console.log("$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list")
        console.log( "$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order")
        console.log( "$ ./task del INDEX            # Delete the incomplete item with the given index")
        console.log("$ ./task done INDEX           # Mark the incomplete item with the given index as complete")
        console.log("$ ./task help                 # Show usage");
        console.log( "$ ./task report               # Statistics");
        break;


    case 'del':
        index=argsData[1];
        index--;
        incompleteTasks=tasks.filter((task)=>(task.done!==1));
        if(!argsData[1]){
            console.log("Error: Missing NUMBER for deleting tasks.")
            break;
        }
        if(!incompleteTasks[index]){
            console.log(`Error: task with index #${index+1} does not exist. Nothing deleted.`)
            break;
        }
        key=incompleteTasks[index].key;
        tasks=tasks.filter((task)=>task.key!==key);
        fs.writeFileSync("todos.json",JSON.stringify(tasks))
        console.log(`Deleted task #${index+1}`)
        break;

    case 'done':
        index=argsData[1];
        index--;
        if(!argsData[1]){
            console.log("Error: Missing NUMBER for marking tasks as done.");
            break;
        }
        incompleteTasks=tasks.filter((task)=>(task.done!==1));
        if(!incompleteTasks[index]){
            console.log(`Error: no incomplete item with index #${index+1} exists.`)
            break;
        }
        key=incompleteTasks[index].key;
        tasks=tasks.map((task)=>{
            if(task.key===key){
                task.done=1;
                return task;
            }
            else{
                return task;
            }
        })
        fs.writeFileSync("todos.json",JSON.stringify(tasks));
        console.log("Marked item as done.")
        break;

    case 'report':
        incompleteTasks=tasks.filter((task)=>(task.done!==1));

        console.log("Pending :",incompleteTasks.length);

        for(let i=1;i<=incompleteTasks.length;i++){
            console.log(`${i}. ${incompleteTasks[i-1].todo} [${incompleteTasks[i-1].priority}]`)
        }

        completeTasks=tasks.filter((task)=>(task.done===1));

        console.log("\nCompleted :",completeTasks.length);

        for(let i=1;i<=completeTasks.length;i++){
            console.log(`${i}. ${completeTasks[i-1].todo}`)
        }

        
}


