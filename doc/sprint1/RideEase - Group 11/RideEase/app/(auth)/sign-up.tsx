import { Text, View, ScrollView, Image, Alert } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { useState, useEffect } from "react";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";


const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [showSuccessModal, setShowSuccessModal] = useState(false);
 
  const [form, setForm] = useState({
    name:'',
    email:'',
    password:''
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code:"",
  });

  // useEffect(() => {
  //   if (verification.state === "success"){
  //     console.log("Setting showSuccessModal to true");
  //     setShowSuccessModal(true);
  //   }
  //  }, [verification.state]);


  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification, 

        state: "pending"
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      if (completeSignUp.status === 'complete') {
        // TODO: Create a database user

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success"});
        setShowSuccessModal(true);
      } else {
        setVerification({ ...verification, error: "Verification failed", state: "failed"})
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({ ...verification, error: err.errors[0].longMessage, state: "failed"})
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[225px]">
          <Image 
            source={images.splash} className="z-0 w-full h-[200px]"
          />
          <Text className="text-xl text-white font-JakartaSemiBold absolute bottom-6 left-4">
            Create Your Account
          </Text>
        </View>
          <View className="p-5">
            <InputField 
              label="Name"
              placeholder="Enter your name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => 
                setForm({ ...form, 
                  name: value})}
            />
            <InputField 
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => 
                setForm({ ...form, 
                  email: value})}
            />
            <InputField 
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => 
                setForm({ ...form, 
                  password: value})}
            />
            <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6"
            />
                  
            <OAuth />
            <Link href="/sign-in" className="text-lg text-center text-general-200 mt-5">
              <Text>Already have an account?{" "}</Text>
              <Text className="text-blue-500 underline">Sign In</Text>
            </Link>
          </View>

          <ReactNativeModal 
            isVisible={verification.state === "pending"}
            onModalHide={() => {router.push("/(root)/(tabs)/home")}}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300p]">
              <Text className="text-2xl font-JakartaExtraBold mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}
              </Text>
              <InputField
                label="Code"
                icon={icons.lock} 
                placeholder="12345"
                value={verification.code} 
                keyboardType="numeric" 
                onChangeText={(code) =>
                  setVerification({ ...verification, code})
                }
              />

              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton title="Verify Email" 
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>

          {/* <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account
              </Text>
              <CustomButton title="Browse Home" 
              onPress={ () => {
                //setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home")}
              }
              className="mt-5"
              />
            </View>
          </ReactNativeModal> */}
      </View>
    </ScrollView>
  )
}
export default SignUp;

