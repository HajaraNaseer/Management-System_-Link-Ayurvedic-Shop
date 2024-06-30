import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/addbill.css"
import Navbar from "./navbar";
import CaptureBill from "./captureBill";

function AddBill() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [data, setData] = useState([])
    const [cart, setCart] = useState([])
    const [input, setInput] = useState({
        id: "",
        quantity: 1,
        amount: "",
        discount: 0,
        method: "CASH",
        balance: 0
    })
    const [total, setTotal] = useState(0)
    const [bill, setBill] = useState(null)

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
                const response = await Axios.get("http://localhost:3001/product/all")
                if (response.data.status) {
                    setData(response.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleClear = () => {
        setInput({
            id: "",
            quantity: 1,
            amount: "",
            discount: 0,
            method: "CASH",
            balance: 0
        })
    }

    const handleAdd = () => {
        if (input.id !== "" && input.quantity !== "" && Number (input.quantity)>0 && Number(input.id)>0) {
            if (cart.some(item => item.productId == input.id)) {
                alert("Product already added");
                return;
            }

            const product = data.find(item => item.id == input.id);

            if (product) {
                if(product.active){

                if (product.stock >= input.quantity) {
                    if (new Date(product.expiry_date) > new Date()) {
                        const newItem = {
                            productId: product.id,
                            productName: product.name,
                            productQuantity: product.quantity,
                            expiryDate: product.expiry_date.split('T')[0],
                            unit: input.quantity,
                            price: product.selling_price,
                            totalPrice: Number(input.quantity) * Number(product.selling_price)
                        };

                        setCart(prev => [...prev, newItem]);
                        setTotal(prev => Number(prev) + newItem.totalPrice);
                        handleClear();
                    } else {
                        alert("Product is expired");
                    }
                } else {
                    alert("Product stock not enough");
                }
            } else {
                alert("Product is blocked");
            }
        }else {
                alert("No product found");
            }
        } else {
            alert("Enter a valid Id and Quantity");
        }
    };


    const renderCart = () => {
        if (cart.length > 0) {
            return cart.map((item, index) => (
                <tr key={index} className="addBill_cart_row">
                    <td className="addBill_cart_data">{item.productName}</td>
                    <td className="addBill_cart_data">{item.productQuantity}</td>
                    <td className="addBill_cart_data">{Number(item.price).toFixed(2)}</td>
                    <td className="addBill_cart_data">{item.unit}</td>
                    <td className="addBill_cart_data">{Number(item.totalPrice).toFixed(2)}</td>
                </tr>
            ))
        } else {
            return (
                <tr className="addBill_cart_message_row">
                    <td className="addBill_cart_message" colSpan="5">No items in the cart</td>
                </tr>
            )
        }
    }

    const handleSubmit = async (e) => {
        if (total === 0) {
            alert("Cart is empty");
            return;
        } else if (input.amount === "") {
            alert("Enter amount");
            return;
        } else {
            let discount = 0;
            let balance = 0;

            if (!isNaN(input.discount)) {
                discount = Number(input.discount) < 1 ? Number(total) * Number(input.discount) : Number(input.discount);
            } else {
                alert("Enter a valid discount");
                return;
            }

            if(discount>=total){
                alert("Enter a valid discount")
                return;
            }

            balance = Number(input.amount) - (Number(total) - discount);

            if (balance >= 0) {
                setInput(prev => ({ ...prev, discount: discount, balance: balance }));
                const sendData = async () => {
                    try {
                        const postData = {
                            userId: state.id,
                            subTotal: Number(total).toFixed(2),
                            discount: discount.toFixed(2),
                            grandTotal: (Number(total) - discount).toFixed(2),
                            paid: Number(input.amount).toFixed(2),
                            balance: balance.toFixed(2),
                            method: input.method,
                            items: cart
                        }
                        const response = await Axios.post("http://localhost:3001/bill/add", postData)
                        if (response.data.status) {
                            alert(response.data.message)
                            setBill(response.data.data)
                            setInput({
                                id: "",
                                quantity: 1,
                                amount: "",
                                discount: 0,
                                method: "CASH",
                                balance: 0
                            })
                            // handleClear();
                            // setCart([]);
                            // setTotal(0);
                        } else {
                            alert(response.data.message)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                sendData()
            } else {
                alert("Given amount is low");
                return;
            }
        }
    };

    return (
        <div className="addBill_wrapper">
            <Navbar />
            <div className="addBill_container">
                <div className="addBill_heading_div">
                    <span className="addBill_heading">Add Bill</span>
                </div>
                <div className="addBill_main">
                    <div className="addBill_display">
                        <div className="addBill_body">
                            <form className="addBill_item_form">
                                <div className="addBill_item_form_div">
                                    <label className="addBill_item_form_label">Product Id : </label>
                                    <input type="number" className="addBill_item_form_field" name="id" value={input.id} placeholder="Enter product's ID" onChange={(e) => { setInput(prev => ({ ...prev, id: e.target.value })) }} />
                                </div>
                                <div className="addBill_item_form_div">
                                    <label className="addBill_item_form_label">Product Quantity : </label>
                                    <input type="number" className="addBill_item_form_field" name="quantity" value={input.quantity} placeholder="Enter product's quantity" onChange={(e) => { setInput(prev => ({ ...prev, quantity: e.target.value })) }} />
                                </div>
                                <div className="addBill_item_form_btn">
                                    <input type="button" value="Add" className="addBill_item_form_btn_add" onClick={(e) => handleAdd(e)} />
                                    <input type="button" value="Clear" className="addBill_item_form_btn_clear" onClick={(e) => handleClear(e)} />
                                </div>
                            </form>
                            <div className="addBill_detail">
                                <span className="addBill_detail_data">Total: {Number(total).toFixed(2)} LKR</span>
                                <span className="addBill_detail_data">Cart: {cart.length}</span>
                            </div>
                            <table className="addBill_table">
                                <thead>
                                    <tr className="addBill_cart_row">
                                        <th className="addBill_cart_head">Name</th>
                                        <th className="addBill_cart_head">Quantity</th>
                                        <th className="addBill_cart_head">Price</th>
                                        <th className="addBill_cart_head">Unit</th>
                                        <th className="addBill_cart_head">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderCart()}
                                </tbody>
                            </table>
                        </div>
                        <div className="addBill_bill_div">
                            <form className="addBill_bill_form">
                                <div className="addBill_bill_form_div">
                                    <label className="addBill_bill_form_label">Given Amount : </label>
                                    <input type="number" className="addBill_bill_form_field" name="amount" value={input.amount} placeholder="Enter given amount" onChange={(e) => { setInput(prev => ({ ...prev, amount: e.target.value })) }} />
                                </div>
                                <select name="method" value={input.method} className="addbill_bill_select_field" onChange={(e) => { setInput(prev => ({ ...prev, method: e.target.value })) }}>
                                    <option value="CASH" className="addbill_bill_select_value">CASH</option>
                                    <option value="CARD" className="addbill_bill_select_value" disabled>CARD</option>
                                </select>
                                <div className="addBill_bill_form_div">
                                    <label className="addBill_bill_form_label">Discount : </label>
                                    <input type="number" className="addBill_bill_form_field" name="discount" value={input.discount} placeholder="Enter any discount avalible" onChange={(e) => { setInput(prev => ({ ...prev, discount: e.target.value })) }} />
                                </div>
                                <div className="addBill_bill_out_div">
                                    <span className="addBill_bill_out">Balance : {Number(input.balance).toFixed(2)} LKR</span>
                                </div>
                                <div className="addBill_bill_form_btn">
                                    <input type="button" value="Submit" className="addBill_bill_form_btn_submit" onClick={(e) => handleSubmit(e)} />
                                    <input type="button" value="Clear" className="addBill_bill_form_btn_clear" onClick={(e) => handleClear(e)} />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="addBill_bill">
                        {bill && <CaptureBill bill={bill} data={cart} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBill