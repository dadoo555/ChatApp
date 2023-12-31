import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'


const Register = ()=>{

    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [nicknameError, setNicknameError] = useState(false)
    const [password, setPassword] = useState("")
    const [imageName, setImageName] = useState("")
    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState(null)
    const navigate = useNavigate()
    
    const gotoLogin = ()=>{
        navigate('/chat/login')
    }

    let nicknameErrorMessage = []
    if (nicknameError){
        nicknameErrorMessage = 
            <div className="error-nickname">
                Nickname already used!
            </div>
    }

    const inputFile = useRef(null)
    const clickFileUpload = (e) => {
        e.preventDefault()
        inputFile.current.click();
      };
 
    const fileOnChange = (e)=>{
        setImageName(e.target.files[0].name)
        setImage(e.target.files[0])
        if (e.target.files && e.target.files[0]) {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
          }
    }

    const imagePreview = <img className="preview-image" src={imageUrl} alt={imageName} />
    
    const registerNewUser = (e)=>{
        e.preventDefault()
        
        const data = new FormData()
        data.append('name', name)
        data.append('nickname', nickname)
        data.append('password', password)
        data.append('picture', image)
        data.append('picturename', imageName)
        
        fetch('/chat/api/users/new', {
            method: 'POST',
            body: data
        }).then((response)=>{
            if (response.ok){
                gotoLogin()
                console.log('resp ok')
            } else {
                if (response.status == 409){
                    //same username
                    setNicknameError(true)
                } else {
                    alert('Error new user: ' + response.statusText)
                }
            }
        }).catch((err)=>{
            throw err
        })
    }

    return (

        <div id="structure-register">
            <form id="form-register" autoComplete="off" onSubmit={(e)=>{registerNewUser(e)}}>
                <label htmlFor="name-reg">Name</label>
                <input  type="text" placeholder="Name..." id="name-reg" 
                        autoComplete="name" value={name} onChange={(e)=>{setName(e.currentTarget.value)}} required></input>
                <label htmlFor="nickname-reg">Nickname</label>
                <input  type="text" placeholder="Nickname123..." id="nickname-reg" 
                        autoComplete="username" value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}} required></input>
                {nicknameErrorMessage}
                <label htmlFor="password-reg">Password</label>
                <input  type="password" placeholder="Password..." id="password-reg" 
                        autoComplete="new-password" value={password} onChange={(e)=>{setPassword(e.currentTarget.value)}} required></input>
                
                <label>Profile picture</label>
                <input  type="file" id="picture-reg" ref={inputFile} style={{display: 'none'}}
                        onChange={fileOnChange} accept="image/*"></input>
                <div className="box-profile-picture">
                    <button onClick={(e) => clickFileUpload(e)} className="btn-fileupload">Upload a profile picture</button>
                    {imagePreview}
                </div>
                <button type="submit"><b>Register</b></button>

                <hr/>
                <p>Already a member? Sign In here</p>
                <div className="btn-login" onClick={gotoLogin}><b>Sign In</b></div>
            </form>
        </div>
    )
}

export default Register