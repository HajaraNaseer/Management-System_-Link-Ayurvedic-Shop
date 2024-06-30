const db = require('../Database/DB');

require('dotenv').config()

const { billItemSave, validateItems, productItemSave } = require('../Function/billFunction')


const getBillCount = (req, res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM bill"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const addBill = (req, res) => {
    const { userId, subTotal, discount, grandTotal, paid, balance, method, items } = req.body
    if (!userId || !subTotal || !discount || !grandTotal || !paid || !balance || !method || !items) {
        return res.status(400).json({ status: false, message: "Input all necessary data" });
    }

    if (items.length == 0) {
        return res.status(400).json({ status: false, message: "Insert the products" });
    }

    if (!validateItems(items)) {
        return res.status(400).json({ status: false, message: "Duplicate products found" });
    }

    const validMethods = ['CASH', 'CARD'];
    if (!validMethods.includes(method)) {
        return res.status(400).json({ status: false, message: "Invalid payment method" });
    }


    const sqlBill = "INSERT INTO bill(user_id,sub_total,discount,grand_total,paid,balance,method,date) VALUES(?,?,?,?,?,?,?,NOW())"
    db.query(sqlBill, [userId, subTotal, discount, grandTotal, paid, balance, method], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err })
        } else {
            if (!result.insertId) {
                return res.status(500).json({ status: false, message: "Bill Generate Fail" })
            } else {
                const billId = result.insertId
                items.map(item => {
                    const status = billItemSave(billId, item.productId, item.productName, item.productQuantity, item.expiryDate, item.price, item.unit, item.totalPrice)
                    const statusProduct = productItemSave(item.productId, item.unit)
                    if (!status) {
                        return res.status(500).json({ status: false, message: "Bill Item insert error" });
                    } else if (!statusProduct) {
                        return res.status(500).json({ status: false, message: "Bill Item insert error" });
                    }
                })
                const sqlBill = "SELECT * FROM bill WHERE id = ?"
                db.query(sqlBill, [billId], (err, result) => {
                    if (err) {
                        return res.status(400).json({ status: false, message: err });
                    } else if (result.length == 0) {
                        return res.status(400).json({ status: false, message: "Invalid bill id" });
                    } else {
                        return res.status(200).json({ status: true, message: "Bill Generated Successfully", data: result[0]});
                    }
                })
            }
        }
    })
}

const viewBill = (req, res) => {
    const { billId } = req.body

    if (!billId) {
        return res.status(400).json({ status: false, message: "Input bill id" });
    }

    const sqlBill = "SELECT * FROM bill WHERE id = ?"
    db.query(sqlBill, [billId], (err, result) => {
        if (err) {
            return res.status(400).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(400).json({ status: false, message: "Invalid bill id" });
        } else {
            const sqlBillView = "SELECT * from bill_detail WHERE bill_id = ?"
            db.query(sqlBillView, [billId], (err, resultBill) => {
                if (err) {
                    return res.status(400).json({ status: false, message: err });
                } else if (resultBill.length > 0) {
                    return res.status(200).json({ status: true, data: { bill: result[0], billDetail: resultBill } });
                } else {
                    return res.status(500).json({ status: false, message: "Database fetch error" });
                }
            })
        }
    })
}


const billController = {
    getBillCount,
    addBill,
    viewBill
}
module.exports = billController