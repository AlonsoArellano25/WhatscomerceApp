import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Perfil from '../Screens/Perfil/Perfil';

const Stack = createStackNavigator();

export default function PerfilStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen component={Perfil} name="perfil" options={{headerShown: false}} />
        </Stack.Navigator>
    )
}