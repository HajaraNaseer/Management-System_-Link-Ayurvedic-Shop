import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate, useParams } from "react-router-dom";
import "../style/updateproduct.css"
import Navbar from "./navbar";
import validate from "../Validations/updateProductValidation";
function UpdateProduct() {
    const { id } = useParams()
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })
    const [input, setInput] = useState({
        name: "",
        category: "",
        quantity: "",
        stock: "",
        description: "",
        self: "",
        manufacturedDate: "",
        expiryDate: "",
        buyingPrice: "",
        sellingPrice: "",
        company: ""
    })
    const [error, setError] = useState({
        name: "",
        category: "",
        quantity: "",
        stock: "",
        description: "",
        self: "",
        manufacturedDate: "",
        expiryDate: "",
        buyingPrice: "",
        sellingPrice: "",
        company: ""
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
        const fetchData = async () => {
            try {
                const postData = {
                    id: id
                }
                const response = await Axios.post("http://localhost:3001/product/get", postData)
                if (response.data.status) {
                    setInput({
                        name: response.data.data.name,
                        category: response.data.data.category,
                        quantity: response.data.data.quantity,
                        stock: response.data.data.stock,
                        description: response.data.data.description,
                        self: response.data.data.self,
                        manufacturedDate: new Date(response.data.data.manufactured_date).toISOString().split('T')[0],
                        expiryDate: new Date(response.data.data.expiry_date).toISOString().split('T')[0],
                        buyingPrice: response.data.data.buying_price,
                        sellingPrice: response.data.data.selling_price,
                        company: response.data.data.company
                    })
                } else {
                    alert(response.data.message)
                    navigate("/viewproduct")
                }
            } catch (error) {
                console.log(error)
                navigate("/viewproduct")
            }
        }
        fetchData()
    }, [state.id])


    const handleChange = (e) => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleReset = () => {
        navigate(`/updateproduct/${id}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            console.log(input)
            const sendData = async () => {
                try {
                    const postData = {
                        id : id,
                        userId: state.id,
                        name: input.name.trim(),
                        category: input.category,
                        quantity: input.quantity.trim(),
                        stock: input.stock,
                        description: input.description.trim(),
                        self: input.self,
                        manufacturedDate: input.manufacturedDate,
                        expiryDate: input.expiryDate,
                        buyingPrice: input.buyingPrice,
                        sellingPrice: input.sellingPrice,
                        company: input.company.trim()
                    }
                    const response = await Axios.put("http://localhost:3001/product/update", postData)
                    if (response.data.status) {
                        alert(response.data.message)
                        navigate("/viewproduct")
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
        <div className="updateProduct_wrapper">
            <Navbar />
            <div className="updateProduct_container">
                <form className="updateProduct_form" onSubmit={(e) => handleSubmit(e)} onReset={handleReset}>
                    <div className="updateProduct_heading_div"><span className="updateProduct_heading">Edit Product</span></div>
                    <div className="updateProduct_form_input">
                        <label htmlFor="name" className="updateProduct_form_label">Name</label>
                        <input type="text" className="updateProduct_form_field" name="name" value={input.name} placeholder="Enter name here" onChange={(e) => handleChange(e)} />
                        {error.name && <span className="updateProduct_form_error">{error.name}</span>}
                    </div>
                    <div className="updateProduct_form_input">
                        <label htmlFor="quantity" className="updateProduct_form_label">Quantity</label>
                        <input type="text" className="updateProduct_form_field" name="quantity" value={input.quantity} placeholder="Enter quantity here" onChange={(e) => handleChange(e)} />
                        {error.quantity && <span className="updateProduct_form_error">{error.quantity}</span>}
                    </div>
                    <div className="updateProduct_form_input">
                        <label htmlFor="category" className="updateProduct_form_label">Category</label>
                        <select name="category" value={input.category} className="updateProduct_form_select_field" onChange={(e) => handleChange(e)}>
                        <option value="" className="updateProduct_form_select_value">Select Category</option>
                            <option value="Oil" className="updateProduct_form_select_value">Oil</option>
                            <option value="Herbal Gel" className="updateProduct_form_select_value">Herbel Gel</option>
                            <option value="Paste" className="updateProduct_form_select_value">Paste</option>
                            <option value="Gum Resin" className="updateProduct_form_select_value">Gum Resin</option>
                            <option value="Tablets" className="updateProduct_form_select_value">Tablets</option>
                            <option value="Bottle" className="updateProduct_form_select_value">Bottle</option>
                            <option value="Special Drink" className="updateProduct_form_select_value">Special Drink</option>
                            <option value="Syrup" className="updateProduct_form_select_value">Syrup</option>
                            <option value="Raw Oil" className="updateProduct_form_select_value">Raw Oil</option>
                            <option value="Cream" className="updateProduct_form_select_value">Cream</option>
                            <option value="Powder" className="updateProduct_form_select_value">Powder</option>
                            <option value="Balm" className="updateProduct_form_select_value">Balm</option>
                            <option value="Soap" className="updateProduct_form_select_value">Soap</option>
                            <option value="Herbal Tea" className="updateProduct_form_select_value">Herbal Tea</option>
                        </select>
                        {error.category && <span className="updateProduct_form_error">{error.category}</span>}
                    </div>
                    <div className="updateProduct_form_row">
                        <div className="updateProduct_form_input">
                            <label htmlFor="stock" className="updateProduct_form_label">Stock</label>
                            <input type="number" className="updateProduct_form_field" name="stock" value={input.stock} placeholder="Enter stock here" onChange={(e) => handleChange(e)} />
                            {error.stock && <span className="updateProduct_form_error">{error.stock}</span>}
                        </div>
                        <div className="updateProduct_form_input">
                            <label htmlFor="self" className="updateProduct_form_label">Shelf no</label>
                            <input type="number" className="updateProduct_form_field" name="self" value={input.self} placeholder="Enter self number" onChange={(e) => handleChange(e)} />
                            {error.self && <span className="updateProduct_form_error">{error.self}</span>}
                        </div>
                    </div>
                    <div className="updateProduct_form_row">
                        <div className="updateProduct_form_input">
                            <label htmlFor="manufacturedDate" className="updateProduct_form_label">Manufactured Date</label>
                            <input type="date" className="updateProduct_form_field" name="manufacturedDate" value={input.manufacturedDate} onChange={(e) => handleChange(e)} />
                            {error.manufacturedDate && <span className="updateProduct_form_error">{error.manufacturedDate}</span>}
                        </div>
                        <div className="updateProduct_form_input">
                            <label htmlFor="expiryDate" className="updateProduct_form_label">Expiry Date</label>
                            <input type="date" className="updateProduct_form_field" name="expiryDate" value={input.expiryDate} onChange={(e) => handleChange(e)} />
                            {error.expiryDate && <span className="updateProduct_form_error">{error.expiryDate}</span>}
                        </div>
                    </div>
                    <div className="updateProduct_form_row">
                        <div className="updateProduct_form_input">
                            <label htmlFor="buyingPrice" className="updateProduct_form_label">Buying Price</label>
                            <input type="number" className="updateProduct_form_field" name="buyingPrice" value={input.buyingPrice} placeholder="Enter buying price here" onChange={(e) => handleChange(e)} />
                            {error.buyingPrice && <span className="updateProduct_form_error">{error.buyingPrice}</span>}
                        </div>
                        <div className="updateProduct_form_input">
                            <label htmlFor="sellingPrice" className="updateProduct_form_label">Selling Price</label>
                            <input type="number" className="updateProduct_form_field" name="sellingPrice" value={input.sellingPrice} placeholder="Enter selling price here" onChange={(e) => handleChange(e)} />
                            {error.sellingPrice && <span className="updateProduct_form_error">{error.sellingPrice}</span>}
                        </div>
                    </div>
                    <div className="updateProduct_form_input">
                        <label htmlFor="company" className="updateProduct_form_label">Company</label>
                        <input type="text" className="updateProduct_form_field" name="company" value={input.company} placeholder="Enter company name here" onChange={(e) => handleChange(e)} />
                        {error.company && <span className="updateProduct_form_error">{error.company}</span>}
                    </div>
                    <div className="updateProduct_form_input">
                        <label htmlFor="description" className="updateProduct_form_label">Description</label>
                        <input type="text" className="updateProduct_form_field" name="description" value={input.description} placeholder="Enter description here" onChange={(e) => handleChange(e)} />
                        {error.description && <span className="updateProduct_form_error">{error.description}</span>}
                    </div>
                    <div className="updateProduct_btn">
                        <input type="submit" value="Update Product" className="updateProduct_btn_submit" />
                        <input type="reset" value="Clear" className="updateProduct_btn_reset" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProduct