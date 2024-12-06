import { Tabs } from 'expo-router';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { View, Image } from 'react-native';
import { icons } from '@/constants';

const TabIcon = ({source, focused }
  :{source:ImageSourcePropType, focused: boolean}) => (
    <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    <Image
      source={source}
      style={{
        width: 35,
        height: 35,
        tintColor: focused ? '#66BB6A' : 'white', // Change color dynamically
      }}
      resizeMode="contain"
    />
    </View>
  </View>
)
const Layout = () => (

    <Tabs
    initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333344",
          borderRadius: 50,
          paddingBottom: 20,
          marginHorizontal: 20,
          marginBottom: 25,
          height: 75,
          display: "flex",
          justifyContent: "space-between",
          alignItems:"center",
          flexDirection:"row",
          position:"absolute"
        }
        // headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute',
        //   },
        //   default: {},
        // }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          )
        }}
      />

<Tabs.Screen
        name="rides"
        options={{
          title: 'Rides',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.list} />
          )
        }}
      />

<Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.chat} />
          )
        }}
      />

<Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          )
        }}
      />

<Tabs.Screen
        name="view-requests"
        options={{
          title: 'View Requests',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.selectedMarker} />
          )
        }}
      />
      
    </Tabs>
  );

export default Layout