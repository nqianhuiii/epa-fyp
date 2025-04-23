export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
export const fullNameRegex = /^[a-zA-Z\s]{2,}$/

export const validateEmail = (email:string):boolean => {
    return emailRegex.test(email);
}

export const validatePassword = (password:string):boolean => {
    return passwordRegex.test(password);
}

export const validateUsername = (username:string):boolean => {
    return usernameRegex.test(username);
}

export const validateFullName = (fullName:string):boolean => {
    return fullNameRegex.test(fullName);
}