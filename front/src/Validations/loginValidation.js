function validate(state){
    let error = {
        email : "",
        password : ""
    }

    const email = state.email.trim()
    const password = state.password.trim()
    if(email === ""){
        error.email = "Email field is empty"
    }else if(!(/^[a-zA-Z]{2}[a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email))){
        error.email = "Invalid Email address"
    }else{
        error.email = ""
    }

    if(password === ""){
        error.password = "Password field is empty"
    }else if(password.length < 3){
        error.password = "Password require atleast 3 digits"
    }else if(/\s/.test(password)){
        error.password = "Invalid password"
    }else{
        error.password = ""
    }

    return error
}

export default validate