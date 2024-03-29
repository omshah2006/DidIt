import Home from "./Screens/Home";
import Onboarding from "./Screens/Onboarding"
import Signup from "./Screens/Signup"
import Picture from "./Screens/Picture";
import Photos from "./Screens/Photos"
import Photo from "./Screens/Photo"
import Account from "./Screens/Account"
import setGoal from "./Screens/setGoal"
import Social from "./Screens/Social"
import Communities from "./Screens/Communities"
import completedGoal from "./Screens/completedGoal"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen 
          name="Signup"
          component={Signup}
        />
        <Stack.Screen 
          name="completedGoal"
          component={completedGoal}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen 
          name="Onboarding"
          component={Onboarding}
        />
        <Stack.Screen 
          name="Home"
          component={Home}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen 
          name="setGoal"
          component={setGoal}
        />
        <Stack.Screen
          name="Picture"
          component={Picture}
        />
        <Stack.Screen
          name="Photos"
          component={Photos}
        />
        <Stack.Screen
          name="Photo"
          component={Photo}
        />
        <Stack.Screen
          name="Account"
          component={Account}
        />
        <Stack.Screen
          name="Social"
          component={Social}
        />
        <Stack.Screen
          name="Communities"
          component={Communities}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
