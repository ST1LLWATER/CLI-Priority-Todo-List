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
let arguments = process.argv;
arguments.shift();
arguments.shift();
let argsData=arguments;

switch(arguments[0]){
    case 'add':
        argsData.shift();
        let data=argsData.join(" ");
        let [priority,...work]=data.split(" ");
        let todo=work.join(" ");
        let task={
            todo,
            priority,
            done:0
        }
        tasks.push(task);
        console.log(`Added Task: "${todo}" With Priority ${priority}`);
        tasks.sort(function(a, b){
            return a.priority - b.priority;
        });
        fs.writeFileSync("todos.json",JSON.stringify(tasks))
        break;

    case 'ls':
        incompleteTasks=tasks.filter((task)=>(task.done!==1));

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

    case 'del':
        index=argsData[1];
        index--;
        tasks.splice(index,1);
        fs.writeFileSync("todos.json",JSON.stringify(tasks))
        break;

    case 'done':
        index=argsData[1];
        index--;
        tasks[index].done=1;
        fs.writeFileSync("todos.json",JSON.stringify(tasks));
        break;

    case 'report':
        incompleteTasks=tasks.filter((task)=>(task.done!==1));

        console.log("Pending: ",incompleteTasks.length);

        for(let i=1;i<=incompleteTasks.length;i++){
            console.log(`${i}. ${incompleteTasks[i-1].todo} [${incompleteTasks[i-1].priority}]`)
        }

        completeTasks=tasks.filter((task)=>(task.done===1));

        console.log("\nCompleted: ",completeTasks.length);

        for(let i=1;i<=completeTasks.length;i++){
            console.log(`${i}. ${completeTasks[i-1].todo} [${completeTasks[i-1].priority}]`)
        }

        
}


