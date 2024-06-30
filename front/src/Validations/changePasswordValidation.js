function validate(state){
    let error = {
        password : "",
        cpassword: ""
    }

    const password = state.password.trim()
    const cpassword = state.cpassword.trim()
    
    if(password === ""){
        error.password = "Password field is empty"
    }else if(password.length < 3){
        error.password = "Password require atleast 3 digits"
    }else if(/\s/.test(password)){
        error.password = "Invalid password"
    }else{
        error.password = ""
    }

    if(cpassword === ""){
        error.cpassword = "Confirm Password field is empty"
    }else if(cpassword.length < 3){
        error.cpassword = "Password require atleast 3 digits"
    }else if(/\s/.test(cpassword)){
        error.cpassword = "Invalid password"
    }else if(password !== cpassword){
        error.cpassword = "Password and Confirm password must be same"
    }else{
        error.cpassword = ""
    }

    return error
}

export default validate