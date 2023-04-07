import Home from './Screens/Home.js';
import Login from './Screens/Login.js';
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
       
   
      </Stack.Navigator>
    </NavigationContainer>
  );
}