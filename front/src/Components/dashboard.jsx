import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css"
import Navbar from "./navbar";
function Dashboard() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [isAdmin, setIsAdmin] = useState(false)
    const [isInventory, setIsInventory] = useState(false)

    const [data, setData] = useState({
        admin: 0,
        cashier: 0,
        inventory: 0,
        product: 0,
        bill: 0,
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

    useEffect(() => {
        if (state.id !== "") {
            if (state.role === "ADMIN") {
                setIsAdmin(true)
            } else if (state.role === "INVENTORY") {
                setIsInventory(true)
            }
        }
        const fetchAdmin = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/admin/admin_count")
                if (response.data.status) {
                    setData(prev => ({
                        ...prev,
                        admin: response.data.data.count
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchCashier = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/admin/cashier_count")
                if (response.data.status) {
                    setData(prev => ({
                        ...prev,
                        cashier: response.data.data.count
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchInventory = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/admin/inventory_count")
                if (response.data.status) {
                    setData(prev => ({
                        ...prev,
                        inventory: response.data.data.count
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchProduct = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/product/count")
                if (response.data.status) {
                    setData(prev => ({
                        ...prev,
                        product: response.data.data.count
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchBill = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/bill/count")
                if (response.data.status) {
                    setData(prev => ({
                        ...prev,
                        bill: response.data.data.count
                    }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAdmin()
        fetchCashier()
        fetchInventory()
        fetchProduct()
        fetchBill()
    }, [state.id])



    const renderData = () => {
        if (state.id === "") {
            return (
                <span className="dashboard_data_message">Loading</span>
            )
        } else {
            return (
                <div className="dashboard_data_div">
                    <span className="dashboard_data_data">ID : {state.id}</span>
                    <span className="dashboard_data_data">Name : {state.name}</span>
                    <span className="dashboard_data_data">Role : {state.role}</span>
                    {isAdmin && <span className="dashboard_data_data">Total Admin : {data.admin}</span>}
                    {isAdmin && <span className="dashboard_data_data">Total Cashier : {data.cashier}</span>}
                    {isAdmin && <span className="dashboard_data_data">Total Inventory Manager: {data.inventory}</span>}
                    {(isAdmin || isInventory) && <span className="dashboard_data_data">Total Product : {data.product}</span>}
                    {isAdmin && <span className="dashboard_data_data">Total Order : {data.bill}</span>}
                </div>
            )
        }
    }
    return (
        <div className="dashboard_wrapper">
            <Navbar/>
            <div className="dashboard_container">
                <div className="dashboard_data">
                    {renderData()}
                </div>
            </div>
        </div>
    )
}

export default Dashboard