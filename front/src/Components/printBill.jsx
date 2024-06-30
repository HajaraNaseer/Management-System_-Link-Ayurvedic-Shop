import React from "react";
import "../style/printbill.css"

function PrintBill({ bill, data }) {
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    }

    function renderData() {
        return data.map(item => (
            <tr className="bill_table_data_row">
                <td className="bill_table_data">{item.productName} [{item.productQuantity}]</td>
                <td className="bill_table_data">{item.unit}</td>
                <td className="bill_table_data">{Number(item.price).toFixed(2)}</td>
                <td className="bill_table_data">{Number(item.totalPrice).toFixed(2)}</td>
            </tr>
        ))
    }
    return (
        <div className="bill_container">
            <div className="bill_heading">
                <span className="bil_heading_name">Link Ayurvedic Shop</span>
                <span className="bil_heading_address">No.290, Galle Road, Aluthgama</span>
                <span className="bil_heading_phone">Tel No : 034-2270123</span>
            </div>
            <div className="bill_detail">
                <span className="bill_detail_date">Date: {new Date().toISOString().split('T')[0]}</span>
                <span className="bill_detail_time">Time: {getCurrentTime()}</span>
                <span className="bill_detail_bill">Bill No : {bill.id}</span>
            </div>
            <table className="bill_table">
                <thead>
                    <tr className="bill_table_head_row">
                        <th className="bill_table_head">Item</th>
                        <th className="bill_table_head">Qty</th>
                        <th className="bill_table_head">Price</th>
                        <th className="bill_table_head">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {renderData()}
                </tbody>
            </table>
            <div className="bill_data_main_div">
                <div className="bill_data_div">
                    <span className="bill_data_label">Total:</span>
                    <span className="bill_data_value">{Number(bill.sub_total).toFixed(2)}</span>
                </div>
                <div className="bill_data_div">
                    <span className="bill_data_label">Discount:</span>
                    <span className="bill_data_value">{Number(bill.discount).toFixed(2)}</span>
                </div>
                <div className="bill_data_div">
                    <span className="bill_data_label">Net Total:</span>
                    <span className="bill_data_value">{Number(bill.grand_total).toFixed(2)}</span>
                </div>
                <div className="bill_data_div">
                    <span className="bill_data_label">Cash Paid:</span>
                    <span className="bill_data_value">{Number(bill.paid).toFixed(2)}</span>
                </div>
                <div className="bill_data_div">
                    <span className="bill_data_label">Return:</span>
                    <span className="bill_data_value">{Number(bill.balance).toFixed(2)}</span>
                </div>
            </div>
            <div className="bill_footer">
                <span className="bill_footer_line">Hope to see you soon</span>
                <span className="bill_footer_line">Thank you for your visit</span>
            </div>
        </div>
    )
}

export default PrintBill