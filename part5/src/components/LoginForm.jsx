const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  }) => {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          username 
          <input 
            value={username}
            onChange={handleUsernameChange}
          />

          password 
          <input 
          type="password"
          value={password}
          onChange={handlePasswordChange}
          />

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

export default LoginForm