import { FormControl, FormControlHelperText, FormControlLabelText } from "../ui/form-control";
import { Text } from "../ui/text";
import { Input, InputField, InputSlot } from "../../components/ui/input";
import { Ionicons } from '@expo/vector-icons';

interface CustomInputWithErrorMsgProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    secureTextEntry?: boolean;
    error?: string;
    required?: boolean;
    showTogglePassword?: boolean;
    showPassword?: boolean;
    onTogglePasswordVisibility?: () => void;
}

const CustomInputWithErrorMsg: React.FC<CustomInputWithErrorMsgProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    autoCapitalize = "none",
    secureTextEntry = false,
    error,
    required = false,
    showTogglePassword = false,
    showPassword,
    onTogglePasswordVisibility
}) => {
    return (
        <FormControl className="mt-6">
            <FormControlLabelText className="text-xl text-black-900 mb-2 flex-row">
                {label}
                {required && <Text className="text-red-500"> *</Text>}
            </FormControlLabelText>
            <Input className="h-11 rounded-xl border-0 bg-gray-100 shadow-none p-0 flex-row items-center">
                <InputField
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    type={showTogglePassword ? (showPassword ? "text" : "password") : "text"}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry && !showPassword}
                    className={`flex-1 px-3 py-2 ${
                        error ? 'border-red-500' : 'border-0'
                    }`}
                />
                {showTogglePassword && (
                    <InputSlot className="pr-3" onPress={onTogglePasswordVisibility}>
                        <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="gray"
                        />
                    </InputSlot>
                )}
            </Input>
            {error && (
                <FormControlHelperText className="text-red-500 mt-1">
                    {error}
                </FormControlHelperText>
            )}
        </FormControl>
    );
};


export default CustomInputWithErrorMsg;

