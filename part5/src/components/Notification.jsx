const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return (
    <div className={`notification ${notification.type}`} >
    <h4>{notification.message}</h4>
    </div>
  )
}

export default Notification