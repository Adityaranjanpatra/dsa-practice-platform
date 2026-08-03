const validator = require('validator');

const validate = (data)=>{
    const mandatoryField=['firstName','emailId','password'];
    const isAllowed = mandatoryField.every((field)=> Object.keys(data).includes(field));

    if(!isAllowed){
        throw new Error('All fields are required');
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error('Invalid emailId');
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error('Password is weak');
    }

    
}

module.exports = validate;