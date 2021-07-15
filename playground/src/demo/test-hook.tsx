import {useState} from 'react'
let i = 0
export default function TestHook() {
  console.log('render TestHook')
    debugger
    const [count, setCount] = useState(i)
    return (
      <div className="TestHook">
        <div><span>{count}</span></div>
        <button id="test" onClick={() => {
            debugger
            setCount(i++)
            setCount(i++)
            setCount(i++)
        }}>click</button>
      </div>
    );
}