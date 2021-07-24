module.exports = {
    validateUserInput: (userEmail,password)=>{
        const errors={};
        const emailRegex= /([a-zA-Z0-9.])+(@vitstudent.ac.in)/g;
        if(userEmail.trim()===''){
            errors['userEmail'] = "UserEmail cannot be empty";
        } else if(!userEmail.match(emailRegex)){
            errors['userEmail'] = "User Email doesn't match vit email";
        }
        if(password.trim()===''){
            errors['password'] = "Password cannot be empty";
        }
        return { errors , valid: errors!=={} }
    }
}