import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mypage from '../screens/MypageScreen';
import Social from '../screens/Social';
import Statistics from '../screens/Statistics';
import Reward from '../screens/Reward';
import AccountManagement from '../screens/AccountManagement';
import BackButton from '../components/BackButton';

const Stack = createNativeStackNavigator();

export default function MyPageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MypageMain" 
        component={Mypage} 
        options={{ 
          title: 'Mypage',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Social"
        component={Social}
        options={({ navigation }) => ({
          title: '친구',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerShown: true,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={({ navigation }) => ({
          title: '통계',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerShown: true,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Reward"
        component={Reward}
        options={({ navigation }) => ({
          title: '리워드',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerShown: true,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="AccountManagement"
        component={AccountManagement}
        options={({ navigation }) => ({
          title: '계정관리',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerShown: true,
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
