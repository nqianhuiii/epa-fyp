import { validateFullName, validateUsername } from "./regexValidation";

export const validateUserProfileForm = (fullName: string, userName: string) => {

    let isValid = true;
    let errors = {
        fullNameError: "",
        userNameError: "",
    }

    if(!validateFullName(fullName)){
        errors.fullNameError = "Full name must be at least 2 characters.";
        isValid = false;
    }else{
        errors.fullNameError = "";
    }

    if(!validateUsername(userName)){
        errors.userNameError = "Username must be 3-20 characters (letters, numbers, underscore only)";
        isValid = false;
    }else{
        errors.userNameError = "";
    }

    return {isValid, errors};
}
