import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Toast from 'react-native-toast-message';

import BackButton from './src/components/BackButton';
import InitialScreen from './src/screens/InitialScreen';
import SignUpEmail from './src/screens/SignUp_Email';
import EmailVerification from './src/screens/EmailVerification';
import SignUpName from './src/screens/SignUp_Name';
import SignUpFin from './src/screens/SignUp_Fin';
import SignIn from './src/screens/SignIn';
import ForgotPWEmail from './src/screens/ForgotPW_Email';
import EmailVerificationPW from './src/screens/EmailVerification_PW';
import ForgotPWNewPW from './src/screens/ForgotPW_NewPW';
import ForgotPWFin from './src/screens/ForgotPW_Fin';
import ChangePW from './src/screens/ChangePW';
import NotificationScreen from './src/screens/NotificationScreen';
import BottomNavigator from './src/navigation/BottomNavigator';

import { toastConfig } from './src/components/CustomToast';
import { AuthProvider } from './src/core/context/authContext';
import { UserProvider } from './src/core/context/userContext';
import { DataProvider } from './src/core/context/dataContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <DataProvider>
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
                  name="EmailVerification"
                  component={EmailVerification}
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
                  name="ForgotPWEmail"
                  component={ForgotPWEmail}
                  options={({ navigation }) => ({
                    title: '계정복구',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
                <Stack.Screen
                  name="EmailVerificationPW"
                  component={EmailVerificationPW}
                  options={({ navigation }) => ({
                    title: '계정복구',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
                <Stack.Screen
                  name="ForgotPWNewPW"
                  component={ForgotPWNewPW}
                  options={({ navigation }) => ({
                    title: '계정복구',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
                <Stack.Screen
                  name="ForgotPWFin"
                  component={ForgotPWFin}
                  options={({ navigation }) => ({
                    title: '계정복구',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
                <Stack.Screen
                  name="Main"
                  component={BottomNavigator}
                  options={{ gestureEnabled: false, headerShown: false }}

                />
                <Stack.Screen
                  name="ChangePW"
                  component={ChangePW}
                  options={({ navigation }) => ({
                    title: '계정복구',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
                <Stack.Screen
                  name="Notification"
                  component={NotificationScreen}
                  options={({ navigation }) => ({
                    title: '알림',
                    headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
                    headerShown: true,
                    headerShadowVisible: false,
                  })}
                />
              </Stack.Navigator>
            </NavigationContainer>
          <Toast config={toastConfig} />
        </DataProvider>
      </UserProvider>
    </AuthProvider>
  );
}