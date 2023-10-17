import { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'



const FormRegister = (props)=>{


    function ImagePreview (props){
        return (
            <img className="preview-image" src={props.url} alt="" />
        )
    }


    const nameForm = props.name
    const nicknameForm = props.nickname
    const passwordForm = props.password
    const imageForm = props.image
    const registerNewUser = (e)=>{
        e.preventDefault()
        
        const data = new FormData()
        data.append('name', nameForm)
        data.append('nickname', nicknameForm)
        data.append('password', passwordForm)
        // data.append('picture', imageForm)
        
        fetch('/chat/api/users/new', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
            body: new URLSearchParams(data)
        }).then((response)=>{
            if (response.ok){
                props.gotoLogin()
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
                    autoComplete="name" value={props.name} onChange={(e)=>{props.changeName(e)}} required></input>
            <label htmlFor="nickname-reg">Nickname</label>
            <input  type="text" placeholder="Nickname123..." id="nickname-reg" 
                    autoComplete="username" value={props.nickname} onChange={(e)=>{props.changeNickname(e)}} required></input>
            {props.showNicknameError}
            <label htmlFor="password-reg">Password</label>
            <input  type="password" placeholder="Password..." id="password-reg" 
                    autoComplete="new-password" value={props.password} onChange={(e)=>{props.changePassword(e)}} required></input>
            
            <label>Profile picture</label>
            <input  type="file" id="picture-reg" 
                    ref={props.inputFile} 
                    style={{display: 'none'}}
                    onChange={props.fileOnChange}
                    accept="image/*"
            ></input>
            <div className="box-profile-picture">
                <button onClick={(e) => props.clickFileUpload(e)} className="btn-fileupload">Upload a profile picture</button>
                <ImagePreview url={props.imageUrl}></ImagePreview>
            </div>
            <p className="preview-name">{props.imageName}</p>
            <button type="submit"><b>Register</b></button>

            <hr/>
            <p>Already a member? Sign In here</p>
            <div className="btn-login" onClick={props.gotoLogin}><b>Sign In</b></div>
        </form>
    </div>
    )
}




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

    const changeName = (e)=>{
        setName(e.target.value)
    }
    const changeNickname = (e)=>{
        setNickname(e.target.value)
    }
    const changePassword = (e)=>{
        setPassword(e.target.value)
    }


    let showNicknameError = []
    if (nicknameError){
        showNicknameError = 
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

    
    return (
        <FormRegister 
            nickname={nickname} 
            name={name} 
            password={password} 
            image={image}
            gotoLogin={gotoLogin}
            showNicknameError={showNicknameError}
            clickFileUpload={clickFileUpload}
            fileOnChange={fileOnChange}
            inputFile={inputFile}
            imageName={imageName}
            imageUrl={imageUrl}
            changeName={changeName}
            changeNickname={changeNickname}
            changePassword={changePassword}
        ></FormRegister>
    )
}

export default Register