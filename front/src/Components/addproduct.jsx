import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/addproduct.css"
import Navbar from "./navbar";
import validate from "../Validations/addProductValidation";
function AddProduct() {
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
        company: "",
        image: ""
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
        company: "",
        image:""
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
        if (e.target.name === "image") {
            setInput(prev => ({
                ...prev,
                [e.target.name]: e.target.files[0]
            }))
        } else {
            setInput(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }

    const handleReset = () => {
        setInput({
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
            company: "",
            image: ""
        })
        setError({
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
            company: "",
            image: ""
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(input)
        setError(errors)
        if (Object.values(errors).every(item => item === "")) {
            const sendData = async () => {
                try {
                    const config = {
                        headers: {
                          'content-type': 'multipart/form-data',
                        },
                      };
                    const postData = {
                        userId : state.id,
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
                        company: input.company.trim(),
                        image: input.image
                    }
                    const response = await Axios.post("http://localhost:3001/product/add", postData,config)
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
        <div className="addProduct_wrapper">
            <Navbar />
            <div className="addProduct_container">
                <form className="addProduct_form" onSubmit={(e) => handleSubmit(e)} onReset={handleReset}>
                    <div className="addProduct_heading_div"><span className="addProduct_heading">Add Product</span></div>
                    <div className="addProduct_form_input">
                        <label htmlFor="name" className="addProduct_form_label">Name</label>
                        <input type="text" className="addProduct_form_field" name="name" value={input.name} placeholder="Enter name here" onChange={(e) => handleChange(e)} />
                        {error.name && <span className="addProduct_form_error">{error.name}</span>}
                    </div>
                    <div className="addProduct_form_input">
                        <label htmlFor="quantity" className="addProduct_form_label">Quantity</label>
                        <input type="text" className="addProduct_form_field" name="quantity" value={input.quantity} placeholder="Enter quantity here" onChange={(e) => handleChange(e)} />
                        {error.quantity && <span className="addProduct_form_error">{error.quantity}</span>}
                    </div>
                    <div className="addProduct_form_input">
                        <label htmlFor="category" className="addProduct_form_label">Category</label>
                        <select name="category" value={input.category} className="addProduct_form_select_field" onChange={(e) => handleChange(e)}>
                            <option value="" className="addProduct_form_select_value">Select Category</option>
                            <option value="Oil" className="addProduct_form_select_value">Oil</option>
                            <option value="Herbal Gel" className="addProduct_form_select_value">Herbel Gel</option>
                            <option value="Paste" className="addProduct_form_select_value">Paste</option>
                            <option value="Gum Resin" className="addProduct_form_select_value">Gum Resin</option>
                            <option value="Tablets" className="addProduct_form_select_value">Tablets</option>
                            <option value="Bottle" className="addProduct_form_select_value">Bottle</option>
                            <option value="Special Drink" className="addProduct_form_select_value">Special Drink</option>
                            <option value="Syrup" className="addProduct_form_select_value">Syrup</option>
                            <option value="Raw Oil" className="addProduct_form_select_value">Raw Oil</option>
                            <option value="Cream" className="addProduct_form_select_value">Cream</option>
                            <option value="Powder" className="addProduct_form_select_value">Powder</option>
                            <option value="Balm" className="addProduct_form_select_value">Balm</option>
                            <option value="Soap" className="addProduct_form_select_value">Soap</option>
                            <option value="Face Wash" className="addProduct_form_select_value">Face Wash</option>
                            <option value="Herbal Tea" className="addProduct_form_select_value">Herbal Tea</option>
                        </select>
                        {error.category && <span className="addProduct_form_error">{error.category}</span>}
                    </div>
                    <div className="addProduct_form_row">
                        <div className="addProduct_form_input">
                            <label htmlFor="stock" className="addProduct_form_label">Stock</label>
                            <input type="number" className="addProduct_form_field" name="stock" value={input.stock} placeholder="Enter stock here" onChange={(e) => handleChange(e)} />
                            {error.stock && <span className="addProduct_form_error">{error.stock}</span>}
                        </div>
                        <div className="addProduct_form_input">
                            <label htmlFor="self" className="addProduct_form_label">Shelf no</label>
                            <input type="number" className="addProduct_form_field" name="self" value={input.self} placeholder="Enter self number" onChange={(e) => handleChange(e)} />
                            {error.self && <span className="addProduct_form_error">{error.self}</span>}
                        </div>
                    </div>
                    <div className="addProduct_form_row">
                        <div className="addProduct_form_input">
                            <label htmlFor="manufacturedDate" className="addProduct_form_label">Manufactured Date</label>
                            <input type="date" className="addProduct_form_field" name="manufacturedDate" value={input.manufacturedDate} onChange={(e) => handleChange(e)} />
                            {error.manufacturedDate && <span className="addProduct_form_error">{error.manufacturedDate}</span>}
                        </div>
                        <div className="addProduct_form_input">
                            <label htmlFor="expiryDate" className="addProduct_form_label">Expiry Date</label>
                            <input type="date" className="addProduct_form_field" name="expiryDate" value={input.expiryDate} onChange={(e) => handleChange(e)} />
                            {error.expiryDate && <span className="addProduct_form_error">{error.expiryDate}</span>}
                        </div>
                    </div>
                    <div className="addProduct_form_row">
                        <div className="addProduct_form_input">
                            <label htmlFor="buyingPrice" className="addProduct_form_label">Buying Price</label>
                            <input type="number" className="addProduct_form_field" name="buyingPrice" value={input.buyingPrice} placeholder="Enter buying price here" onChange={(e) => handleChange(e)} />
                            {error.buyingPrice && <span className="addProduct_form_error">{error.buyingPrice}</span>}
                        </div>
                        <div className="addProduct_form_input">
                            <label htmlFor="sellingPrice" className="addProduct_form_label">Selling Price</label>
                            <input type="number" className="addProduct_form_field" name="sellingPrice" value={input.sellingPrice} placeholder="Enter selling price here" onChange={(e) => handleChange(e)} />
                            {error.sellingPrice && <span className="addProduct_form_error">{error.sellingPrice}</span>}
                        </div>
                    </div>
                    <div className="addProduct_form_input">
                        <label htmlFor="company" className="addProduct_form_label">Company</label>
                        <input type="text" className="addProduct_form_field" name="company" value={input.company} placeholder="Enter company name here" onChange={(e) => handleChange(e)} />
                        {error.company && <span className="addProduct_form_error">{error.company}</span>}
                    </div>
                    <div className="addProduct_form_input">
                        <label htmlFor="description" className="addProduct_form_label">Description</label>
                        <input type="text" className="addProduct_form_field" name="description" value={input.description} placeholder="Enter description here" onChange={(e) => handleChange(e)} />
                        {error.description && <span className="addProduct_form_error">{error.description}</span>}
                    </div>
                    <div className="addProduct_form_input">
                        <label htmlFor="image" className="addProduct_form_label">Image</label>
                        <input type="file" className="addProduct_form_field" name="image" onChange={(e) => handleChange(e)} />
                        {error.image && <span className="addProduct_form_error">{error.image}</span>}
                    </div>
                    <div className="addProduct_btn">
                        <input type="submit" value="Add Product" className="addProduct_btn_submit" />
                        <input type="reset" value="Clear" className="addProduct_btn_reset" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct