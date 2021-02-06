import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tienda from '../Screens/Tienda/Tienda';
import Detalle from '../Screens/Tienda/Detalle';
import MensajesList from '../Screens/Tienda/MensajesList';
import Contacto from '../Screens/Tienda/Contacto';


const Stack = createStackNavigator();

export default function TiendaStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen component={Tienda} name="tienda" options={{ headerShown: false }} />

            <Stack.Screen component={Detalle} name="detalle"
                options={{
                    headerTransparent: true,
                    headerTintColor: "#128C7E",
                    title: ''
                }} />
            <Stack.Screen component={MensajesList} name="mensajes"
                option={{
                    title: 'Mensajes',
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#FFF",
                }} />
            <Stack.Screen component={Contacto} name="contacto"
                option={{
                    title: 'Contacto',
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#FFF",
                }} />
        </Stack.Navigator>
    )
}