import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Icon, Input, Button, Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { validateEmail } from '../Utils/Utils'
import { isEmpty } from 'lodash';
import firebase from 'firebase'
import Loading from './Loading'
import * as GoogleSignIn from "expo-google-sign-in";
//import * as Facebook from "expo-facebook";

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
                        onPress={() => signInAsync(setLoading)}
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
            <Loading isVisible={loading} text="Por favor, espere" />
        </View>
    )
}

/*********LOGICA DE GOOGLE***********************************/

async function signInAsync(setLoading) {
    try {
        await GoogleSignIn.initAsync();
        //const usuario = await GoogleSignIn.signInSilentlyAsync();
        await GoogleSignIn.askForPlayServicesAsync(); //usar solo en android
        const { type, user } = await GoogleSignIn.signInAsync();
        console.log(type)
        if (type === "success") {
            onSignIn(user, setLoading);
            setLoading(false);
            return true;
        } else {
            setLoading(false);
            alert(JSON.stringify(result));
            return { cancelled: true };
        }
    } catch (e) {
        setLoading(false);


        alert(e.message);

        return { error: true };
    }
}

function onSignIn(googleUser, setLoading) {
    const unsubscribe = firebase
        .auth()
        .onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.auth.idToken,
                    googleUser.auth.accessToken
                );
                // Sign in with credential from the Google user.
                setLoading(true);
                firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then((response) => {
                        setLoading(false);
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        alert(errorMessage);
                        setLoading(false);
                        // ...
                    });
            } else {
                alert("Usuario ya está logueado");
            }
        });
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (
                providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}
/**************************** FINAL GOOGLE **************************************** */

/****************************FACEBOOK ********************************************** */
// async function logIn() {
//     try {
//         await Facebook.initializeAsync({
//             appId: "1560987580775767",
//             appName: "omarcito",
//             domain: "connect.facebook.net",
//         });
//         const {
//             type,
//             token,
//             expires,
//             permissions,
//             declinedPermissions,
//         } = await Facebook.logInWithReadPermissionsAsync({
//             permissions: ["public_profile"],
//         });
//         if (type === "success") {
//             // Get the user's name using Facebook's Graph API
//             const response = await fetch(
//                 `https://graph.facebook.com/me?access_token=${token}`
//             );
//             const credential = firebase.auth.FacebookAuthProvider.credential(token);
//             firebase
//                 .auth()
//                 .signInWithCredential(credential)
//                 .catch((error) => {
//                     console.log(JSON.stringify(error));
//                     alert(error.message);
//                 });
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }


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
