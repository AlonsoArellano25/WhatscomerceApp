import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MiTienda from '../Screens/MiTienda/MiTienda';
import EditarProducto from '../Screens/MiTienda/EditarProducto';
import AddProduct from '../Screens/MiTienda/AddProduct';

const Stack = createStackNavigator();

export default function MiTiendaStack() {
    return (
        <Stack.Navigator
            screenOptions={
                {
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#fff",
                }
            }
        >
            <Stack.Screen component={MiTienda} name="mitienda" options={{
                title: "Mi Tienda",
            }} />
            <Stack.Screen component={AddProduct} name="add-product"
                options={{
                    title: 'Agregar Nuevo Producto',
                    headerStyle: { backgroundColor: "#128C7E" },
                    headerTintColor: "#FFF",
                }} />
            <Stack.Screen component={EditarProducto} name="edit-product" options={{
                title: "Editar Producto",
            }} />
        </Stack.Navigator>
    )
}