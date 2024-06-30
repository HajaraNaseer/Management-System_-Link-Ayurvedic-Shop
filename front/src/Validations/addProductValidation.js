function validate(state) {
    let error = {
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
    }

    const name = state.name.trim()
    const company = state.company.trim()
    const category = state.category
    const quantity = state.quantity.trim()
    const stock = state.stock
    const self = state.self
    const description = state.description.trim()
    const manufacturedDate = state.manufacturedDate
    const expiryDate = state.expiryDate
    const sellingPrice = state.sellingPrice
    const buyingPrice = state.buyingPrice
    const image = state.image

    if (name === "") {
        error.name = "Name field is empty"
    } else {
        error.name = ""
    }

    if (quantity === "") {
        error.quantity = "Quantity field is empty"
    } else {
        error.quantity = ""
    }

    if (company === "") {
        error.company = "Company field is empty"
    } else {
        error.company = ""
    }


    if (category === "") {
        error.category = "Select a category"
    } else {
        error.category = ""
    }

    if(stock === ""){
        error.stock = "Stock field is empty"
    }else if(isNaN(stock)){
        error.stock = "Invalid stock amount"
    }else if(Number(stock) < 0){
        error.stock = "Invalid stock amount"
    }else{
        error.stock = ""
    }

    if(self === ""){
        error.self = "Shelf  field is empty"
    }else if(isNaN(self)){
        error.self = "Invalid shelf number"
    }else if(Number(self) < 0){
        error.self = "Invalid shelf number"
    }else{
        error.self = ""
    }

    if(manufacturedDate === ""){
        error.manufacturedDate = "Manufactred date field is empty"
    }else{
        const date = new Date(manufacturedDate)
        if(date > new Date()){
            error.manufacturedDate = "Invalid manufactred date"
        }else{
            error.manufacturedDate = ""
        }
    }

    if(expiryDate === ""){
        error.expiryDate = "Expiry date field is empty"
    }else{
        const mDate = new Date(manufacturedDate)
        const eDate = new Date(expiryDate)
        if(eDate <= new Date() || eDate <= mDate){
            error.expiryDate = "Invalid expiry date"
        }else{
            error.expiryDate = ""
        }
    }
   
    if(buyingPrice === ""){
        error.buyingPrice = "Buying price field is empty"
    }else if(isNaN(buyingPrice)){
        error.buyingPrice = "Invalid buying price"
    }else if(Number(buyingPrice) < 0){
        error.buyingPrice = "Invalid buying price"
    }else{
        error.buyingPrice = ""
    }

    if(sellingPrice === ""){
        error.sellingPrice = "Selling price field is empty"
    }else if(isNaN(sellingPrice)){
        error.sellingPrice = "Invalid selling price"
    }else if(Number(sellingPrice) < 0 || Number(sellingPrice) <= Number(buyingPrice)){
        error.sellingPrice = "Invalid selling price"
    }else{
        error.sellingPrice = ""
    }

    if (image === "") {
        error.image = "Select an image"
    } else {
        error.image = ""
    }

    return error
}

export default validate