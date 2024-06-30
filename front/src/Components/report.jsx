import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/report.css"
import Navbar from "./navbar";

function Report() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

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
    }, [navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/product/popular")
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
                    <td colSpan="8" className="report_message">No items to preview</td>
                </tr>
            )
        } else {
            return filterData.map(item => (
                <tr key={item.id} className="report_item">
                    <td className="report_item_image">
                        <img src={`http://localhost:3001/images/${item.image}`} alt={item.name} />
                    </td>
                    <td className="report_item_data">{item.id}</td>
                    <td className="report_item_data">{item.name}</td>
                    <td className="report_item_data">{item.quantity}</td>
                    <td className="report_item_data">{item.sold}</td>
                </tr>
            )
            )
        }
    }

    return (
        <div className="report_wrapper">
            <Navbar />
            <div className="report_container">
                <div className="report_heading_div">
                    <span className="report_heading">Popular Products</span>
                    <input type="text" className="report_heading_search" name="search" value={search} placeholder="Enter product name" onChange={(e)=>{setSearch(e.target.value)}}/>
                </div>
                <div className="report_item_div">
                    <table className="report_table">
                        <thead>
                            <tr className="report_table_row">
                                <th className="report_table_heading">Image</th>
                                <th className="report_table_heading">ID</th>
                                <th className="report_table_heading">Name</th>
                                <th className="report_table_heading">Quantity</th>
                                <th className="report_table_heading">Sold</th>
                            </tr>
                        </thead>
                        {renderData()}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Report