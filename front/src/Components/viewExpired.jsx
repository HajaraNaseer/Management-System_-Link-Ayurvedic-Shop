import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/viewexpired.css"
import Navbar from "./navbar";

function ExpiredProduct() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [isAuth, setIsAuth] = useState(false) /* Check if login person is CASHIER or NOT. If CASHIER then he can only view items else They can modify it */
    const [data, setData] = useState([])
    const [search,setSearch] = useState("")
    const [filterData,setFilterData] = useState([])

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
        if (state.role !== "") {
            if (state.role === "ADMIN" || state.role === "INVENTORY") {
                setIsAuth(true)
            }
        }
    }, [navigate, state.role])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/product/expired")
                if (response.data.status) {
                    setData(response.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [state.id])

    useEffect(()=>{
        if(search === ""){
            setFilterData(data)
        }else{
            const searchTerm = search.trim().toLowerCase();
            const filtered = data.filter(item => {
                const words = item.name.trim().toLowerCase().split(' ');
                return words.some(word => word.startsWith(searchTerm));
            });
            setFilterData(filtered);
        }
    },[search,data])

    const renderData = () => {
        if (filterData.length === 0) {
            return (
                <tr>
                    <td colSpan="8" className="viewExpired_message">No items to preview</td>
                </tr>
            )
        } else {
            return filterData.map(item => (
                <tr key={item.id} className="viewExpired_item">
                    <td className="viewExpired_item_image">
                        <img src={`http://localhost:3001/images/${item.image}`} alt={item.name} />
                    </td>
                    <td className="viewExpired_item_data">{item.id}</td>
                    <td className="viewExpired_item_data">{item.name}</td>
                    <td className="viewExpired_item_data">{item.quantity}</td>
                    <td className="viewExpired_item_data">{item.stock}</td>
                    <td className="viewExpired_item_data">{item.self}</td>
                    <td className="viewExpired_item_data">{Number(item.selling_price).toFixed(2)} LKR</td>
                    <td className="viewExpired_item_data">{item.expiry_date.split('T')[0]}</td>
                    {isAuth &&
                        <td className="viewExpired_item_data">
                            <div className="viewExpired_item_btn">
                                <input type="button" value="Edit" onClick={() => handleUpdate(item.id)} className="viewExpired_item_btn_update" />
                                {item.active ?
                                    <input type="button" value="Block" onClick={() => handleBlock(item.id)} className="viewExpired_item_btn_block" />
                                    :
                                    <input type="button" value="Unblock" onClick={() => handleUnblock(item.id)} className="viewExpired_item_btn_unblock" />
                                }
                                <input type="button" value="Delete" onClick={() => handleDelete(item.id)} className="viewExpired_item_btn_delete" />
                            </div>
                        </td>
                    }
                </tr>
            )
            )
        }
    }

    const handleUpdate = (id) => {
        navigate(`/updateproduct/${id}`)
    }

    const handleBlock = (id) => {
        const sendData = async () => {
            try {
                const postData = {
                    id: id
                }
                const response = await Axios.post("http://localhost:3001/product/block", postData)
                if (response.data.status) {
                    alert(response.data.message)
                    navigate("/viewexpired")
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        sendData()
    }

    const handleUnblock = (id) => {
        const sendData = async () => {
            try {
                const postData = {
                    id: id
                }
                const response = await Axios.post("http://localhost:3001/product/unblock", postData)
                if (response.data.status) {
                    alert(response.data.message)
                    navigate("/viewexpired")
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        sendData()
    }

    const handleDelete = (id) => {
        const sendData = async () => {
            try {
                const postData = {
                    id: id
                }
                const response = await Axios.delete("http://localhost:3001/product/delete",{ data :postData })
                if (response.data.status) {
                    alert(response.data.message)
                    navigate("/viewexpired")
                } else {
                    alert(response.data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        sendData()
    }

    return (
        <div className="viewExpired_wrapper">
            <Navbar />
            <div className="viewExpired_container">
                <div className="viewExpired_heading_div">
                    <span className="viewExpired_heading">Expired Products</span>
                    <input type="text" className="viewExpired_heading_search" name="search" value={search} placeholder="Enter product name" onChange={(e)=>{setSearch(e.target.value)}}/>
                </div>
                <div className="viewExpired_item_div">
                    <table className="viewExpired_table">
                        <thead>
                            <tr className="viewExpired_table_row">
                                <th className="viewExpired_table_heading">Image</th>
                                <th className="viewExpired_table_heading">ID</th>
                                <th className="viewExpired_table_heading">Name</th>
                                <th className="viewExpired_table_heading">Quantity</th>
                                <th className="viewExpired_table_heading">Stock</th>
                                <th className="viewExpired_table_heading">Shelf no</th>
                                <th className="viewExpired_table_heading">Price</th>
                                <th className="viewExpired_table_heading">Expiry Date</th>
                                {isAuth && <th className="viewExpired_table_heading">Action</th>}
                            </tr>
                        </thead>
                        {renderData()}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ExpiredProduct