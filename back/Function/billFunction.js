const db = require('../Database/DB')


const billItemSave = async (billId, productId, productName, productQuantity, expiryDate, price, unit , totalPrice) => {
    const sqlBillItem = "INSERT INTO bill_detail(bill_id,product_id,product_name,product_quantity,expiry_date,price,unit,total_price) VALUES(?,?,?,?,?,?,?,?)"
    db.query(sqlBillItem, [billId, productId, productName, productQuantity, expiryDate, price, unit, totalPrice], (err, result) => {
        if (err) {
            console.log(err)
            return false
        } else if (result.affectedRows > 0) {
            return true
        } else {
            return false
        }
    })
}

const productItemSave = async (productId, unit) => {
    const sqlProductFetch = "SELECT stock , sold FROM product WHERE id = ?"
    db.query(sqlProductFetch, [productId], (err, result) => {
        if (err) {
            return false
        } else if (result.length === 0) {
            return false
        } else {
            const stock = Number(result[0].stock) - Number(unit)
            const sold = Number(result[0].sold) + Number(unit)
            const sqlProductChange = "UPDATE product SET stock = ? , sold = ? WHERE id = ?"
            db.query(sqlProductChange, [stock, sold, productId], (err, result) => {
                if (err) {
                    return false
                } else if (result.affectedRows > 0) {
                    return true
                } else {
                    return false
                }
            })
        }
    })
}


const validateItems = (items) => {
    const itemIds = items.map(item => item.productId);
    const uniqueItemIds = new Set(itemIds);

    return uniqueItemIds.size === itemIds.length;
};


module.exports = { billItemSave, productItemSave, validateItems }