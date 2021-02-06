import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, Input, Button, Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { validateEmail } from '../Utils/Utils'
import { isEmpty, size } from 'lodash';
import firebase from 'firebase'
import Loading from './Loading'

export default function RegisterForm({ toastRef }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [repetirPassword, setrepetirPassword] = useState("")
    const navigation = useNavigation()
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [loading, setLoading] = useState(false)

    function crearCuenta() {
        if (isEmpty(email) || isEmpty(password) || isEmpty(repetirPassword)) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (!validateEmail(email)) {
            toastRef.current.show("Email no es valido")
        } else if (password !== repetirPassword) {
            toastRef.current.show("Las contraseñas tienen que ser iguales")
        } else if (size(password) < 6) {
            toastRef.current.show("Las contraseñas deben tener al menos 6 caracteres")
        } else {
            setLoading(true);
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((resp) => {
                    toastRef.current.show("Se ha creado el usuario correctamente")
                    setLoading(false)
                    setEmail("");
                    setPassword("");
                    setrepetirPassword("");
                })
                .catch((e) => {
                    setLoading(false)
                    toastRef.current.show("Ha ocurrido un error")
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
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.input}
                leftIcon={{
                    type: "material-community",
                    name: "security",
                    color: "#128c7e",
                }}
                rightIcon={{
                    type: "material-community",
                    name: show2 ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShow2(!show2)
                }}
                onChangeText={(text) => { setrepetirPassword(text) }}
                secureTextEntry={!show2}
                value={repetirPassword}
            />
            <Button title="REGISTRAR" containerStyle={styles.btnEntrar} buttonStyle={{ backgroundColor: "#25d366" }}
                onPress={crearCuenta} />
            <Button title="INICIAR SESIÓN" containerStyle={styles.btnEntrar} buttonStyle={{ backgroundColor: "#128c7e" }}
                onPress={() => navigation.goBack()} />

            <Loading isVisible={loading} text="Por favor, espere" />
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
})
