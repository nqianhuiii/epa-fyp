import { validateFullName, validateUsername, validateTitle, validateDescription, validateEmail, validatePassword, validateNonEmpty } from "./regexValidation";

export const validateCreateProfileForm = (fullName: string, userName: string, email: string, password: string) => {

    let isValid = true;
    let errors = {
        fullNameError: "",
        userNameError: "",
        emailError: "",
        passwordError: "",
    }

    if (!validateNonEmpty(fullName)) {
        errors.fullNameError = "Nama penuh tidak boleh kosong";
        isValid = false;
    } else if (!validateFullName(fullName)) {
        errors.fullNameError = "Nama penuh mesti mengandungi sekurang-kurangnya 2 huruf";
        isValid = false;
    }

    if (!validateNonEmpty(userName)) {
        errors.userNameError = "Nama pengguna tidak boleh kosong";
        isValid = false;
    } else if (!validateUsername(userName)) {
        errors.userNameError = "Nama pengguna mesti antara 3–20 aksara (huruf, nombor, dan garis bawah sahaja)";
        isValid = false;
    }

    if (!validateNonEmpty(email)) {
        errors.emailError = "Emel tidak boleh kosong";
        isValid = false;
    } else if (!validateEmail(email)) {
        errors.emailError = "Sila masukkan emel yang sah";
        isValid = false;
    }

    if (!validateNonEmpty(password)) {
        errors.passwordError = "Kata laluan tidak boleh kosong";
        isValid = false;
    } else if (!validatePassword(password)) {
        errors.passwordError = "Kata laluan mesti sekurang-kurangnya 8 aksara dan mengandungi huruf serta nombor";
        isValid = false;
    }
    return {isValid, errors};
}

export const validateLoginForm = (email: string) => {

    let isValid = true;
    let errors = {

        emailError: "",
        passwordError: "",
    }

    if (!validateNonEmpty(email)) {
        errors.emailError = "Emel tidak boleh kosong";
        isValid = false;
    } else if (!validateEmail(email)) {
        errors.emailError = "Sila masukkan emel yang sah";
        isValid = false;
    }

    // if (!validateNonEmpty(password)) {
    //     errors.passwordError = "Kata laluan tidak boleh kosong";
    //     isValid = false;
    // } else if (!validatePassword(password)) {
    //     errors.passwordError = "Kata laluan mesti sekurang-kurangnya 8 aksara dan mengandungi huruf serta nombor";
    //     isValid = false;
    // }
    return {isValid, errors};
}

export const validateUserProfileForm = (fullName: string, userName: string) => {

    let isValid = true;
    let errors = {
        fullNameError: "",
        userNameError: "",
    }

    if(!validateFullName(fullName)){
        errors.fullNameError = "Nama penuh mesti mengandungi sekurang-kurangnya 2 huruf.";
        isValid = false;
    }else{
        errors.fullNameError = "";
    }

    if(!validateUsername(userName)){
        errors.userNameError = "Nama pengguna mesti antara 3–20 aksara (huruf, nombor, dan garis bawah sahaja)";
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
