import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Chat = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-green-400">
      <Text className="text-white text-3xl">Chat</Text>
    </SafeAreaView>
  )
}
export default Chat;
