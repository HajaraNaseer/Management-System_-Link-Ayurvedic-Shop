import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../style/changepassword.css"
import validate from "../Validations/changePasswordValidation";

function ChangePassword() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })
    const [input, setInput] = useState({
        password: "",
        cpassword: ""
    })
    const [error, setError] = useState({
        password: "",
        cpassword: ""
    })
    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/auth/verify")
                if (response.data.status) {
                    setState({
                        id: response.data.data.id,
                        name: response.data.data.name,
                        role: response.data.data.role
                    })
                } else {
                    alert(response.data.message)
                    navigate("/signin")
                }
            } catch (error) {
                console.log(error)
                navigate("/signin")
            }
        }
        sendData()
    }, [navigate])

    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleReset = () => {
        setInput({
            password: "",
            cpassword: ""
        })
        setError({
            password: "",
            cpassword: ""
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(input)
        setError(errors)
        if (Object.values(errors).every(error => error === "")) {
            const sendData = async () => {
                try {
                    const postData = {
                        userId: state.id,
                        password: input.password.trim()
                    }
                    const response = await Axios.post("http://localhost:3001/auth/change_password", postData)
                    if (response.data.status) {
                        alert(response.data.message)
                        navigate("/")
                    } else {
                        alert(response.data.message)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            sendData()
        }
    }
    return (
        <div className="changePassword_wrapper">
            <Navbar/>
            <div className="changePassword_container">
            <form className="changePassword_form" onSubmit={(e) => handleSubmit(e)} onReset={handleReset}>
                <div className="changePassword_heading_div"><span className="changePassword_heading">Change Password</span></div>
                <div className="changePassword_form_input">
                    <label htmlFor="password" className="changePassword_form_label">Password</label>
                    <input type="password" className="changePassword_form_field" name="password" value={input.password} placeholder="Enter your new password" onChange={(e) => handleChange(e)} />
                    {error.password && <span className="changePassword_form_error">{error.password}</span>}
                </div>
                <div className="changePassword_form_input">
                    <label htmlFor="cpassword" className="changePassword_form_label">Confirm Password</label>
                    <input type="password" className="changePassword_form_field" name="cpassword" value={input.cpassword} placeholder="Re-Enter your new password" onChange={(e) => handleChange(e)} />
                    {error.cpassword && <span className="changePassword_form_error">{error.cpassword}</span>}
                </div>
                <div className="changePassword_btn">
                    <input type="submit" value="Change" className="changePassword_btn_submit" />
                    <input type="reset" value="Clear" className="changePassword_btn_reset" />
                </div>
            </form>
        </div>
        </div>
    )
}

export default ChangePassword