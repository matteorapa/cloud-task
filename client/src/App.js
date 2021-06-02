import {useState} from 'react'
import { nanoid } from 'nanoid'

function App() {
  const [largest, setLargest] = useState(100000)
  const [largestInstance, setLargestInstance] = useState('')
  const [smallest, setSmallest] = useState(0)
  const [smallestInstance, setSmallestInstance] = useState('')
  const [client_id] = useState(nanoid())
  const [url] = useState("https://generation-dot-cis3111-cloud-computing-gae.ew.r.appspot.com")

  const generateBatch = (cb) => {

    // fetch request to 10 instances concurrently for numbers (1k each)
    fetch(url +"/generate", {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          client_id: client_id
      })
    }).then( res => {
      return res.json()
    })
    .then((data) => {
      console.log("Numbers generated by instance " + data.instance)
      console.log(data.numbers)
      cb(data)
    })
    .catch(error => {
      console.warn(error)
    })
  }

  const sendRequests = () => {

    let callbacks_recieved = 0

    for (let i = 0; i < 10; i++) {
      generateBatch((data)=>{
        callbacks_recieved++
        if(callbacks_recieved === 10){
          // Request max and min generated numbers
          fetch(url +"/maxmin", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: client_id
            })
          }).then( res => {
            return res.json()
          })
          .then((data) => {
            setSmallest(data.min)
            setLargest(data.max)
            setSmallestInstance(data.min_instance)
            setLargestInstance(data.max_instance)
          })
          .catch(error => {
            console.warn(error)
          })
        }
      })
    }
  }

  return (
    <div className="App">
      <span className="author">Matteo Rapa | <a href="https://github.com/matteorapa/gcloud-task">CIS3111 Cloud Computing Assignment</a></span>

      <div className="spacing">
        <code>{client_id}</code>
        <h1>Generate <strong className="number">10,000</strong> random numbers.</h1>
        <button className="generate-btn" onClick={()=> sendRequests() }>GENERATE</button>
      </div>

      <div className="spacing">
        <h2>The largest generated number is <u>{largest}</u>. <code className="instance">{largestInstance}</code></h2>
        <h2>The smallest generated number is <u>{smallest}</u>. <code className="instance">{smallestInstance}</code></h2>
      </div>
    </div>
  );
}

export default App;
