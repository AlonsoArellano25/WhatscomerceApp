import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';

import TiendaStack from './TiendaStack';
import PerfilStack from './PerfilStack';
import MitiendaStack from './MiTiendaStack';
import ShopButton from '../Components/ShopButton';
import CustomDrawerContent from '../Components/CustomDrawerContent';

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName="tienda"
            tabBarOptions={{
                inactiveTintColor: "#fff",
                activeTintColor: "#fff",
                style: {
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                    alignItems: 'center',
                    backgroundColor: "#128C7E",
                    paddingBottom: 5,

                }
            }}

            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => mostrarIcono(route, color),
            })}
        >
            <Tab.Screen component={TiendaStack} name="tienda" options={{ title: "Tienda" }} />
            <Tab.Screen component={MitiendaStack} name="mitienda" options={{ title: "", tabBarIcon: () => <ShopButton /> }} />
            <Tab.Screen component={PerfilStack} name="cuenta" options={{ title: "Cuenta" }} />
        </Tab.Navigator>
    )

}

function mostrarIcono(route, color) {
    let iconName = "";
    switch (route.name) {
        case 'tienda':
            iconName = "cart-outline";
            break;
        case 'cuenta':
            iconName = "account-circle-outline";
            break;
        case 'mitienda':
            iconName = "cart-outline";
            break;
    }

    return (
        <Icon type="material-community" name={iconName} size={24} color={color} />
    )
}

export default function RutasAutenticadas() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="Tienda"
                    component={TabBar}
                    options={{
                        title: "Tienda",
                        drawerIcon: () => { <Icon type="material-community" name="strore" size={24} /> }
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}