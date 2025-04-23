import { createContext, useContext, useState } from "react";
import { View } from "react-native";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { CheckIcon, InfoIcon } from "../ui/icon";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertContext{
    showAlert: (message: string, type: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContext | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);

    if(!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }

    return context;
}

export const AlertProvider: React.FC<{children:React.ReactNode}> = ({children}) => {

    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<AlertType>("info");
    const [visible, setVisible] = useState(false);

    const showAlert = (message:string, type: AlertType, duration= 3000) => {
        setMessage(message);
        setAlertType(type);
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        },duration);
    };

    const getIconForType = () =>{
        switch(alertType){
            case 'success':
                return CheckIcon;
            case 'warning':
            case 'error':
                return AlertIcon;
            default: 
                return InfoIcon;
        }
    };

    return (
        <AlertContext.Provider value= {{ showAlert }}>
            {children}
            {visible && (
                <View className="absolute bottom-4 left-4 right-4 z-50">
                    <Alert action={alertType} variant="solid">
                        <AlertIcon as={getIconForType()}/>
                        <AlertText>{message}</AlertText>
                    </Alert>
                </View>
            )}
        </AlertContext.Provider>
    )
}