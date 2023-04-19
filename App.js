import Home from "./Screens/Home";
import Login from "./Screens/Login";
import Picture from "./Screens/Picture";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        
        <Stack.Screen 
          name="Login"
          component={Login}
        />
        <Stack.Screen 
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Picture"
          component={Picture}
        />
   
      </Stack.Navigator>
    </NavigationContainer>
  );
}