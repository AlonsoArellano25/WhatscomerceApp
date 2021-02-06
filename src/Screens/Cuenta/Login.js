import React, { useRef } from 'react'
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import LoginForm from '../../Components/LoginForm';
import Toast from 'react-native-easy-toast';

export default function Login() {
    const toastRef = useRef();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#128c7e" />
            <Image
                source={require("../../../assets/logo.png")}
                style={styles.imgLogo}
            />
            <Text style={styles.textobaner}>Bienvenido!</Text>
            <LoginForm toastRef={toastRef} />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#128c7e",
    },
    imgLogo: {
        width: 106,
        height: 106,
        marginTop: 40,
        alignSelf: "center",
    },
    textobaner: {
        fontFamily: "Roboto",
        fontWeight: 'bold',
        fontSize: 30,
        color: "#fff",
        alignSelf: "center",
    }
})
