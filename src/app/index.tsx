import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "../core/constants/screens";

import Home from "../modules/trip/screens/Home";
import RouteScreen from "../modules/trip/screens/Route";
import Costs from "../modules/trip/screens/Costs";
import Rent from "../modules/rent/screens/Rent";
import TravelMode from "../modules/travelMode/screens/TravelMode";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.HOME} component={Home} />
        <Stack.Screen name={SCREENS.ROUTE} component={RouteScreen} />
        <Stack.Screen name={SCREENS.COSTS} component={Costs} />
        <Stack.Screen name={SCREENS.RENT} component={Rent} />
        <Stack.Screen name={SCREENS.TRAVEL_MODE} component={TravelMode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
