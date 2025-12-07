import { useState } from "react"

function MailPage(){
    const [count,setCount]=useState(0);


    return(<>
            <h1>welcome in mail page</h1>
            <button onClick={()=>{setCount(c=>c+1)}}>click me</button>
            <h2>counter : {count}</h2>
        </>
    )
}

export default MailPage