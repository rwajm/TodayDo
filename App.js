import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BackButton from './src/components/BackButton';
import InitialScreen from './src/screens/InitialScreen';
import SignUpEmail from './src/screens/SignUp_Email';
import SignUpEmailCode from './src/screens/SignUp_EmailCode';
import SignUpPW from './src/screens/SignUp_PW';
import SignUpName from './src/screens/SignUp_Name';
import SignUpFin from './src/screens/SignUp_Fin';
import SignIn from './src/screens/SignIn';
import BottomNavigator from './src/navigation/BottomNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialScreen">
        <Stack.Screen
          name="InitialScreen"
          component={InitialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpEmail"
          component={SignUpEmail}
          options={({ navigation }) => ({
            title: '회원가입',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="SignUpEmailCode"
          component={SignUpEmailCode}
          options={({ navigation }) => ({
            title: '회원가입',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="SignUpPW"
          component={SignUpPW}
          options={({ navigation }) => ({
            title: '회원가입',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="SignUpName"
          component={SignUpName}
          options={({ navigation }) => ({
            title: '회원가입',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="SignUpFin"
          component={SignUpFin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={({ navigation }) => ({
            title: '로그인',
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="Main"
          component={BottomNavigator}
          options={{gestureEnabled: false,headerShown: false}}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
