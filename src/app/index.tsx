import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "../core/constants/screens";

import Welcome from "../modules/auth/screens/Welcome";
import Login from "../modules/auth/screens/Login";
import Home from "../modules/trip/screens/Home";
import RouteScreen from "../modules/trip/screens/Route";
import Costs from "../modules/trip/screens/Costs";
import RentScreen from '../modules/rent/screens/Rent';
import TravelModeScreen from '../modules/travelMode/screens/TravelMode';
import GarageScreen from '../modules/garage/screens/Garage';


const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SCREENS.WELCOME}>
        <Stack.Screen name={SCREENS.WELCOME} component={Welcome} />
        <Stack.Screen name={SCREENS.LOGIN} component={Login} />
        <Stack.Screen name={SCREENS.HOME} component={Home} />
        <Stack.Screen name={SCREENS.ROUTE} component={RouteScreen} />
        <Stack.Screen name={SCREENS.COSTS} component={Costs} />
        <Stack.Screen name={SCREENS.RENT} component={RentScreen} />
        <Stack.Screen name={SCREENS.TRAVEL_MODE} component={TravelModeScreen} />
        <Stack.Screen name={SCREENS.GARAGE} component={GarageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
