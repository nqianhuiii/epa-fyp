import { Stack } from "expo-router"
import { AlertProvider } from "../../components/custom/alertProvider"

export default function AuthLayout(){
    return(
        <AlertProvider>
            <Stack screenOptions={{ headerShadowVisible: false }}/>
        </AlertProvider>
    )
}