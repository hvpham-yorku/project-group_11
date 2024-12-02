import { View, Text, Image } from "react-native"
import { GoogleInputProps } from "@/types/type"

const GoogleTextInput = ({
    icon, initialLocation, containerStyle, textInputBackgroundColor, handlPress
}: GoogleInputProps) => (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
        <Text>Search</Text>
    </View>
)

export default GoogleTextInput