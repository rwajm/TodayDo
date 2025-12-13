import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen'
import RecordScreen from '../screens/RecordScreen'
import TodoScreen from '../screens/TodoScreen'
import RoutineScreen from '../screens/RoutineScreen'
//import MypageScreen from '../screens/MypageScreen'
import MyPageStack from './MypageStack';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator(){
  return(
    <Tab.Navigator
      initialRouteName='Home'
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        
        tabBarShowLabel: false,

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        },

        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if(route.name == "Record"){
            return <MaterialCommunityIcons name="playlist-edit" size={size} color={color}/>;
          }
          else if(route.name == "Todo"){
            return <MaterialIcons name="library-add-check" size={size} color={color}/>;
          }
          else if(route.name == "Home"){
            return <Entypo name="home" size={size} color={color}/>;
          }
          else if(route.name == "Routine"){
            return <AntDesign name="history" size={size} color={color}/>;
          }
          else if(route.name == "Mypage"){
            return <Ionicons name="person" size={size} color={color}/>;
          }
        },

          tabBarActiveTintColor: "#3A9CFF",
          tabBarInactiveTintColor: 'gray',
      })}>

      <Tab.Screen name="Record" component={RecordScreen}/>
      <Tab.Screen name="Todo" component={TodoScreen}/>
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Routine" component={RoutineScreen}/>
      <Tab.Screen name="Mypage" component={MyPageStack} options={{headerShown: false}}/>
      
    </Tab.Navigator>
  )
}