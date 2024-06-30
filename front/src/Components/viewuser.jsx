import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../style/viewuser.css"
function ViewUser() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [data, setData] = useState([])

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
                    navigate("/")
                }
            } catch (error) {
                console.log(error)
                navigate("/")
            }
        }
        sendData()
    }, [navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/admin/user")
                if (response.data.status) {
                    setData(response.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [state.id])


    const renderData = () => {
        if (data.length === 0) {
            return (
                <tr className="viewUser_item">
                    <td colSpan="8" className="viewUser_message">No users to preview</td>
                </tr>
            )
        } else {
            return data.map(item => (
                <tr key={item.id} className="viewUser_item">
                    <td className="viewUser_item_data">{item.id}</td>
                    <td className="viewUser_item_data">{item.name}</td>
                    <td className="viewUser_item_data">{item.email}</td>
                    <td className="viewUser_item_data">{item.role}</td>
                </tr>
            )
            )
        }
    }


    return (
        <div className="viewUser_wrapper">
            <Navbar />
            <div className="viewUser_container">
                <div className="viewUser_heading_div">
                    <span className="viewUser_heading">View User</span>
                </div>
                <div className="viewUser_item_div">
                    <table className="viewUser_table">
                        <thead>
                            <tr className="viewUser_table_row">
                                <th className="viewUser_table_heading">ID</th>
                                <th className="viewUser_table_heading">Name</th>
                                <th className="viewUser_table_heading">Email</th>
                                <th className="viewUser_table_heading">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderData()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ViewUser