import { Button, ButtonText } from "../../components/ui/button";
import { Text, View } from "react-native";
import { auth } from "../../utils/firebaseConfig";

export default function Home(){
    return (
      <View>
          <Text style={{fontSize:30}}>Account Screen</Text>
            <Button className="bg-emerald-400 mt-10 rounded-lg" onPress={() => auth.signOut()}>
              <ButtonText>Sign Out</ButtonText>
            </Button>
      </View>
    )
}
