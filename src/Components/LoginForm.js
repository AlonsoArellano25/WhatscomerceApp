import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Icon, Input, Button, Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { validateEmail } from '../Utils/Utils'
import { isEmpty } from 'lodash';
import firebase from 'firebase'
import Loading from './Loading'

export default function LoginForm({ toastRef }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const navigation = useNavigation()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const iniciarSesion = () => {
        if (isEmpty(email) || isEmpty(password)) {
            toastRef.current.show("Debe ingresar los valores de email y password")
        }
        else if (!validateEmail(email)) {
            toastRef.current.show("Ingrese un correo valido")
        } else {
            setLoading(true);
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false);
                    toastRef.current.show("Ha iniciado sesión correctamente")
                    console.log("Todo ok")
                })
                .catch((e) => {
                    setLoading(false)
                    console.log(e)
                    toastRef.current.show("Email o paswword incorrectas")
                })
        }
    }
    return (
        <View style={styles.container}>
            <View style={{ borderBottomColor: "#25D366", borderBottomWidth: 2, width: 100, }} />
            <Input
                placeholder="Correo"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#128c7e",
                }}
                leftIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#128c7e",
                }}
                onChangeText={(text) => { setEmail(text) }}
                value={email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                leftIcon={{
                    type: "material-community",
                    name: "security",
                    color: "#128c7e",
                }}
                rightIcon={{
                    type: "material-community",
                    name: show ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShow(!show)
                }}
                onChangeText={(text) => { setPassword(text) }}
                secureTextEntry={!show}
                value={password}
            />
            <Button title="ENTRAR" containerStyle={styles.btnEntrar} buttonStyle={{ backgroundColor: "#25d366" }}
                onPress={() => iniciarSesion()} />
            <Text style={styles.txtCrearcuenta}>¿No tienes cuenta?
                <Text style={styles.cuenta} onPress={() => navigation.navigate("register")}>{" "}Crear cuenta</Text>
            </Text>
            <Divider style={{ backgroundColor: "#128c7e", height: 1, width: "90%", marginTop: 20 }} />
            <Text style={styles.txtO}>O</Text>
            <View style={styles.btnLogin}>
                <TouchableOpacity style={styles.loginsocial}>
                    <Icon
                        size={24}
                        type="material-community"
                        name="google"
                        color="#fff"
                        backgroundColor="transparent"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginsocial}>
                    <Icon
                        size={24}
                        type="material-community"
                        name="facebook"
                        color="#fff"
                        backgroundColor="transparent"
                    />
                </TouchableOpacity>
            </View>
            <Loading isVisible={loading} text="Por favor, espero" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f6f8",
        flex: 1,
        marginTop: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: "center",
        paddingTop: 20,
    },
    input: {
        width: "90%",
        marginTop: 20,
        height: 50,
    },
    btnEntrar: {
        width: "90%",
        marginTop: 20,
    },
    txtCrearcuenta: {
        marginTop: 20,
    },
    cuenta: {
        color: "#128c7e",
        fontFamily: "Roboto",
        fontSize: 15,
    },
    txtO: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20,
        color: "#128c7e",
    },
    btnLogin: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    loginsocial: {
        backgroundColor: "#25d366",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 5,
    }
})
