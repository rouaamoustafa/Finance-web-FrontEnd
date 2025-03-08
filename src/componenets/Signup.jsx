import React from 'react'
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
        <div className='login-container'>
      <form className='login'>
        <h1 className='h1-sign'>Registration</h1>
        <label> FirstName &amp; FullName <br/> 
            <input className='input-sign' type='text' placeholder='Username' />
        </label> <br/> 
        <label>Email <br/>
            <input className='input-sign' type="email" name="email" placeholder='john@example.com'/>
        </label> <br/>
        <label>Password <br/>
            <input className='input-sign' type="password" name="password" placeholder='password'/>
        </label> <br/> <br/>
        <button className='btn-log' type="submit">
            Sign in
        </button>
        <div className='tosignup'>
            <p className='text-login'>Already have an account ?</p> 
            <p><Link to="/Login"> Sign in </Link></p>
        </div>
      </form>
      </div>
  )
}

export default Signup
