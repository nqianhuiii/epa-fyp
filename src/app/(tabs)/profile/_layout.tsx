import { Stack } from "expo-router";
import { AlertProvider } from "../../../components/custom/alertProvider";

export default function ProfileLayout() {
  return (
    <AlertProvider>
        <Stack/>
    </AlertProvider>
  );
}
