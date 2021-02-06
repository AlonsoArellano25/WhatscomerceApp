import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../Screens/Cuenta/Login';
import Registrar from '../Screens/Cuenta/Registrar';
import RestaurarPassword from '../Screens/Cuenta/RestaurarPassword';

const Stack = createStackNavigator();

export default function RutasNoAutenticadas(){
    return(
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{headerShown: false}}
            >
                <Stack.Screen component={Login} name="login"></Stack.Screen>
                <Stack.Screen component={Registrar} name="register"></Stack.Screen>
                <Stack.Screen component={RestaurarPassword} name="lostpassword"></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}