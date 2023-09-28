import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'

const Register = ()=>{

    const navigate = useNavigate()
    const gotoLogin = ()=>{
        navigate('/chat/login')
    }

    const registerNewUser = (e)=>{
        e.preventDefault()

    }

    const inputFile = useRef(null)
    const clickFileUpload = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
      };
    
    return (
        <div id="structure-register">
            <form id="form-register" onSubmit={registerNewUser} autoComplete="off" au>
                <label htmlFor="name-reg">Name</label>
                <input type="text" placeholder="Name..." id="name-reg" autoComplete="name"></input>
                <label htmlFor="nickname-reg">Nickname</label>
                <input type="text" placeholder="Nickname123..." id="nickname-reg" autoComplete="username"></input>
                <label htmlFor="password-reg">Password</label>
                <input type="password" placeholder="Password..." id="password-reg" autoComplete="new-password"></input>
                
                <label>Profile picture</label>
                <input type="file" id="picture-reg" ref={inputFile} style={{display: 'none'}}></input>
                <button onClick={clickFileUpload} className="btn-fileupload">Upload a profile picture</button>

                <button type="submit"><b>Register</b></button>

                <hr/>
                <p>Already a member? Sign In here</p>
                <div className="btn-login" onClick={gotoLogin}><b>Sign In</b></div>
            </form>
        </div>
    )
}

export default Register