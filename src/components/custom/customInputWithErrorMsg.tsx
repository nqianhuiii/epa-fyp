import { FormControl, FormControlHelperText, FormControlLabelText } from "../ui/form-control";
import { Input, InputField } from "../ui/input";

interface CustomInputWithErrorMsgProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType? : "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize? : "none" | "sentences" | "words" | "characters";
    secureTextEntry?: boolean;
    error?: string;
}

const CustomInputWithErrorMsg: React.FC<CustomInputWithErrorMsgProps> =({
    label,
    value,
    onChangeText,
    placeholder, 
    keyboardType = "default",
    autoCapitalize = "none",
    secureTextEntry = false,
    error,
}) => {
    return(
        <FormControl className="mt-6">
            <FormControlLabelText className="text-xl text-black-900 mb-2">
                {label}
            </FormControlLabelText>
            <Input className="h-11 rounded-xl border-0 bg-gray-100 shadow-none p-0">
                <InputField
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    type="text"
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry}
                    className={`rounded-xl border px-3 py-2  ${
                        error
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-0'
                    }`}
                />
            </Input>
            {error ? (
                <FormControlHelperText className="text-red-500 mt-1">
                    {error}
                </FormControlHelperText>
            ) : null}                    
        </FormControl>        
    );
}

export default CustomInputWithErrorMsg;

