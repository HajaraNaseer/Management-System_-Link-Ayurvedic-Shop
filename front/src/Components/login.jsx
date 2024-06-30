import React, { useState } from "react";
import Axios from "axios"
import { CiUnlock } from "react-icons/ci";
import validate from "../Validations/loginValidation";
import "../style/login.css"
import { useNavigate } from "react-router-dom";

function Login() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setState(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleReset = () => {
        setState({
            email: "",
            password: ""
        })
        setError({
            email: "",
            password: ""
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(state)
        setError(errors)
        if (Object.values(errors).every(error => error === "")) {
           const sendData = async() => {
            try{
                const postData = {
                    email : state.email.trim().toLowerCase(),
                    password : state.password.trim()
                }
                const response = await Axios.post("http://localhost:3001/auth/signin",postData)
                if(response.data.status){
                    navigate("/")
                }else{
                    alert(response.data.message)
                }
            }catch(error){
                console.log(error)
            }
           }
           sendData()
        }
    }
    return (
        <div className="login_container">
            <div className="login_head">
                <span className="login_head_main">Link Ayurvedic Shop</span>
                <span className="login_head_sub">No. 290, Galle Road, Aluthgama</span>
            </div>
            <form className="login_form" onSubmit={(e) => handleSubmit(e)} onReset={handleReset}>
                <div className="login_heading_div"><CiUnlock className="login_icon" /><span className="login_heading">Login</span></div>
                <div className="login_form_input">
                    <label htmlFor="email" className="login_form_label">Email</label>
                    <input type="text" className="login_form_field" name="email" value={state.email} placeholder="Enter your email here" onChange={(e) => handleChange(e)} />
                    {error.email && <span className="login_form_error">{error.email}</span>}
                </div>
                <div className="login_form_input">
                    <label htmlFor="password" className="login_form_label">Password</label>
                    <input type="password" className="login_form_field" name="password" value={state.password} placeholder="Enter your password here" onChange={(e) => handleChange(e)} />
                    {error.password && <span className="login_form_error">{error.password}</span>}
                </div>
                <div className="login_btn">
                    <input type="submit" value="Login" className="login_btn_submit"/>
                    <input type="reset" value="Clear" className="login_btn_reset"/>
                </div>
            </form>
        </div>
    )
}

export default Login