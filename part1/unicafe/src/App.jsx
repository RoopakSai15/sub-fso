import { useState } from 'react'

const Statisticline = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = ((good - bad) / all).toFixed(1)
  const positive = ((good/all)*100).toFixed(1)

  if (all === 0){
    return <div>No feedback given</div>
  }

  return (
    <table>
      <tbody>
        <Statisticline text="good" value ={good}/>
        <Statisticline text="neutral" value={neutral}/>
        <Statisticline text="bad" value={bad}/>
        <Statisticline text="all" value={all}/>
        <Statisticline text="average" value={average}/>
        <Statisticline text="positive" value={positive + " %"}/>
      </tbody>
    </table>
  )
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickGood = () => {
    setGood(good + 1)
  }

  const clickNeutral = () => {
    setNeutral(neutral + 1)
  }

  const clickBad = () => {
    setBad(bad + 1)
  }

  return (
    <>
      <h2>Give Feedback</h2>
      <Button text="good" onClick={clickGood}/>
      <Button text="neutral" onClick={clickNeutral}/>
      <Button text="bad" onClick={clickBad}/>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App
