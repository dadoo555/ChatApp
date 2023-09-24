import { useState } from "react"
import { useNavigate } from 'react-router-dom'

const Login = ()=>{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    
    const gotoRegister = ()=>{
        navigate('/users/create')
    }

    const onLoginClick = (e)=>{
        e.preventDefault()
        const data = Array.from(e.target.elements)
            .filter((input) => input.name)
            .reduce((obj, input) => Object.assign(obj, { [input.name]: input.value }), {});
        fetch('/api/sessions', {
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({data})
            
        }).then(response =>{
            if (response.ok){
                navigate('/')
            } else {
                alert('wrong nickname/password')
            }
        }).catch(err =>{
            throw err
        })
    }

   

    return(
        <div id="structure-login">
            <form id="form-login" method="POST" onSubmit={onLoginClick}>
                <label htmlFor="username">Username</label>
                <input  name="username" 
                        id="username"
                        value={username} 
                        onChange={(e) => setUsername(e.currentTarget.value)} 
                        type="text"
                        placeholder="Username..."></input>
                <label htmlFor="password">Password</label>
                <input  name="password" 
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.currentTarget.value)} 
                        type="password"
                        placeholder="Password..."></input>
                <button type="submit"><b>Sign In</b></button>
                <hr/>
                <p>Not a member? Register here</p>
                <div id="btn-register" onClick={gotoRegister}><b>Register</b></div>
            </form>
        </div>
    )
}



export default Login