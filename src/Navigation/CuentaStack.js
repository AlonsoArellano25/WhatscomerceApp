import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import ConfirmarNumero from '../Screens/Cuenta/ConfirmarNumero';
import EnviarConfirmacion from '../Screens/Cuenta/EnviarConfirmacion';

const Stack = createStackNavigator();

export default function CuentaStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen component={EnviarConfirmacion} name="enviar-confirmacion" options={{
                    title: 'Confirma tu número de teléfono',
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#Fff"
                }} />
                <Stack.Screen component={ConfirmarNumero} name="confirmar-numero" options={{
                    title: 'Confirma Número',
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#Fff"
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}