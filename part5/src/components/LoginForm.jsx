import PropTypes from "prop-types"

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
            data-testid='username'
            value={username}
            onChange={handleUsernameChange}
          />

          password 
          <input 
          data-testid='password'
          type="password"
          value={password}
          onChange={handlePasswordChange}
          />

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm