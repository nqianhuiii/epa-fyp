import { validateFullName, validateUsername, validateTitle, validateDescription } from "./regexValidation";

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

export const validateForumForm = (title: string, description: string) => {

    let isValid = true;
    let errors = {
        title: "",
        description: "",
    }

    if(!validateTitle(title)){
        errors.title = "Title is required.";
        isValid = false;
    }else{
        errors.title = "";
    }

    if(!validateDescription(description)){
        errors.description = "Description is required)";
        isValid = false;
    }else{
        errors.description = "";
    }

    return {isValid, errors};
}
