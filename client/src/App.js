import './App.css';
import {useState, useEffect} from 'react'



function App() {
  const [numbers, setNumbers] = useState([])
  const [largest, setLargest] = useState(0)

  const sendRequests = () => {
    // fetch request to 10 instances concurrently for numbers (1k each)
    fetch("http://...")
    .then( res => {
      return res.json()
    })
    .then((data) => {
      setNumbers(data)
    })
    .catch(error => {
      console.warn(error)
    })
  }

  return (
    <div className="App">
      <h1>Generate 10K Random Numbers</h1>
      <button className="" onClick={()=> sendRequests }>Generate</button>

      <h2>The largest generated number is {largest}</h2>

      <div className="">
        <h3>Largest number generated per instance</h3>
        <ul>
          <li>
            <span>Instance 0: 1253</span>
            <span>Instance 1: 1323</span>
            <span>Instance 2: 1543</span>
          </li>
        </ul>
      </div>


    </div>
  );
}

export default App;
