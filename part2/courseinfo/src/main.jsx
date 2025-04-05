import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const notes = [
  <li>HTML is easy</li>,
  <li>Browser can execute only Javascript</li>,
  <li>GET and POST are the most important methods of HTTP protocols</li>,
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
