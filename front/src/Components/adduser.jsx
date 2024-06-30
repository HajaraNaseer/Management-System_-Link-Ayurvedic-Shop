import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/adduser.css"
import Navbar from "./navbar";
import validate from "../Validations/addUserValidation";
function AddUser() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })
    const [input, setInput] = useState({
        name: "",
        email: "",
        role: "",
        password: ""
    })
    const [error, setError] = useState({
        name: "",
        email: "",
        role: "",
        password: ""
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
            name: "",
            email: "",
            role: "",
            password: ""
        })
        setError({
            name: "",
            email: "",
            role: "",
            password: ""
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            const sendData = async () => {
                try {
                    const name = input.name.trim();
                    const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                    const postData = {
                        name: capitalized,
                        role: input.role,
                        email: input.email.trim().toLowerCase(),
                        password: input.password.trim()
                    }
                    const response = await Axios.post("http://localhost:3001/admin/register",postData)
                    if (response.data.status) {
                        alert(response.data.message)
                        handleReset()
                    } else {
                        alert(response.data.message)
                    }
                } catch (error) {
                    alert(error.response.data.message)
                }
            }
            sendData()
        }
    }

    return (
        <div className="addUser_wrapper">
            <Navbar />
            <div className="addUser_container">
                <form className="addUser_form" onSubmit={(e) => handleSubmit(e)} onReset={handleReset}>
                    <div className="addUser_heading_div"><span className="addUser_heading">Add User</span></div>
                    <div className="addUser_form_input">
                        <label htmlFor="name" className="addUser_form_label">Name</label>
                        <input type="text" className="addUser_form_field" name="name" value={input.name} placeholder="Enter name here" onChange={(e) => handleChange(e)} />
                        {error.name && <span className="addUser_form_error">{error.name}</span>}
                    </div>
                    <div className="addUser_form_input">
                        <label htmlFor="role" className="addUser_form_label">Role</label>
                        <select name="role" value={input.role} className="addUser_form_select_field" onChange={(e) => handleChange(e)}>
                            <option value="" className="addUser_form_select_value">Select a Role</option>
                            <option value="ADMIN" className="addUser_form_select_value">Admin</option>
                            <option value="CASHIER" className="addUser_form_select_value">Cashier</option>
                            <option value="INVENTORY" className="addUser_form_select_value">Inventory Manager</option>
                        </select>
                        {error.role && <span className="addUser_form_error">{error.role}</span>}
                    </div>
                    <div className="addUser_form_input">
                        <label htmlFor="email" className="addUser_form_label">Email</label>
                        <input type="text" className="addUser_form_field" name="email" value={input.email} placeholder="Enter  email here" onChange={(e) => handleChange(e)} />
                        {error.email && <span className="addUser_form_error">{error.email}</span>}
                    </div>
                    <div className="addUser_form_input">
                        <label htmlFor="password" className="addUser_form_label">Password</label>
                        <input type="password" className="addUser_form_field" name="password" value={input.password} placeholder="Enter  password here" onChange={(e) => handleChange(e)} />
                        {error.password && <span className="addUser_form_error">{error.password}</span>}
                    </div>
                    <div className="addUser_btn">
                        <input type="submit" value="Add User" className="addUser_btn_submit" />
                        <input type="reset" value="Clear" className="addUser_btn_reset" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUser