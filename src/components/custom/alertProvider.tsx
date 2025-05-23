import { Ionicons } from '@expo/vector-icons';
import { createContext, useContext, useState } from "react";
import { View } from "react-native";
import { Alert, AlertText } from "../ui/alert";

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

    const getIconForType = () => {
        const baseProps = { size: 20 };

        switch (alertType) {
            case 'success':
            return <Ionicons name="checkmark-circle" color="#22c55e" {...baseProps} />; // green
            case 'error':
            return <Ionicons name="close-circle" color="#ef4444" {...baseProps} />; // red
            case 'warning':
            return <Ionicons name="warning" color="#facc15" {...baseProps} />; // yellow
            case 'info':
            default:
            return <Ionicons name="information-circle" color="#3b82f6" {...baseProps} />; // blue
        }
    };

    return (
        <AlertContext.Provider value= {{ showAlert }}>
            {children}
            {visible && (
                <View className="absolute bottom-4 left-4 right-4 z-50">
                    <Alert action={alertType} variant="solid">
                        {getIconForType()}
                        <AlertText>{message}</AlertText>
                    </Alert>
                </View>
            )}
        </AlertContext.Provider>
    )
}