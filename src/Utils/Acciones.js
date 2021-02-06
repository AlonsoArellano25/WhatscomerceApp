import { firebaseapp } from './Firebase';
import firebase from 'firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import "firebase/firestore"
import uuid from "random-uuid-v4"
import { map } from 'lodash'
import { convertirFicherBlob } from '../Utils/Utils'

const db = firebase.firestore(firebaseapp)

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
})

export const validarSesion = (setValidarSesion) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setValidarSesion(true)
        } else {
            setValidarSesion(false)
        }
    })
}

export const cerrarSesion = () => {
    firebase.auth().signOut();
}

export const validarPhone = (setPhoneAuth) => {
    db.collection("Usuarios").doc(ObtenerUsuario().uid)
        .onSnapshot(snapshot => {
            setPhoneAuth(snapshot.exists);
        })
}

export const enviarautenticacionphone = async (numero, recapcha) => {
    let verificacionid = "";

    await firebase.auth().currentUser.reauthenticateWithPhoneNumber(numero, recapcha.current)
        .then((resp) => {
            verificacionid = resp.verificationId
        })
        .catch(err => console.log(err))

    return verificacionid;
}

export const confirmarcodigo = async (verificationid, codigo) => {
    let resultado = false;
    const credenciales = firebase.auth.PhoneAuthProvider.credential(
        verificationid,
        codigo,
    );
    await firebase.auth().currentUser.linkWithCredential(credenciales)
        .then((resp) => resultado = true)
        .catch((err) => {
            console.log(err)
        })

    return resultado
}

export const obtenerToken = async () => {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export const ObtenerUsuario = () => {
    return firebase.auth().currentUser;
}

export const addRegistroEspecifico = async (coleccion, doc, data) => {
    const resultado = { error: "", statusresponse: false };

    await db.collection(coleccion).doc(doc).set(data, { merge: true })
        .then(resp => {
            resultado.statusresponse = true
        })
        .catch((err) => {
            resultado.error = err
        })

    return resultado
}

export const subirImagenesBatch = async (imagenes, ruta) => {
    const imagenesurl = []
    await Promise.all(
        map(imagenes, async (imagen) => {
            const blob = await convertirFicherBlob(imagen)
            const ref = firebase.storage().ref(ruta).child(uuid())

            await ref.put(blob)
                .then(async (res) => {
                    await firebase.storage().ref(`${ruta}/${res.metadata.name}`)
                        .getDownloadURL()
                        .then((imagenUrl) => {
                            imagenesurl.push(imagenUrl)
                        })
                })
        })
    );

    return imagenesurl
}

export const actualizarPerfil = async (data) => {
    let respuesta = false;
    await firebase.auth().currentUser.updateProfile(data)
        .then((resp) => {
            respuesta = true
        })

    return respuesta
}

export const reauntenticar = async (verificacionId, code) => {
    let response = { statusresponse: false }

    const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificacionId, code)

    await firebase.auth().currentUser.reauthenticateWithCredential(credenciales)
        .then((res) => (response.statusresponse = true))
        .catch((err) => {
            console.log(err)
        })

    return response

}

export const actualizarEmailfirebase = async (email) => {
    let response = { statusresponse: false }

    await firebase.auth().currentUser.updateEmail(email)
        .then((resp) => {
            response.statusresponse = true
        })
        .catch(err => (response.statusresponse = false))

    return response
}

export const actualizarTelefono = async (verificacionid, code) => {
    let response = { statusresponse: false }

    const credenciales = new firebase.auth.PhoneAuthProvider.credential(
        verificacionid,
        code,
    )

    await firebase.auth().currentUser.updatePhoneNumber(credenciales)
        .then((res) => (response.statusresponse = true))
        .catch((err) => {
            console.log(err)
        })

    return response
}

export const addRegistro = async (coleccion, data) => {
    const resultado = { error: "", statusresponse: false };

    await db.collection(coleccion).add(data)
        .then(resp => {
            resultado.statusresponse = true
        })
        .catch((err) => {
            resultado.error = err
        })

    return resultado
}

export const ListarMisProductos = async () => {
    let productos = [];

    await db.collection("Productos")
        .where("usuario", "==", ObtenerUsuario().uid)
        .where("status", "==", 1)
        .get()
        .then((resp) => {
            resp.forEach((doc) => {
                const prod = doc.data();
                prod.id = doc.id
                productos.push(prod)
            })
        })
        .catch((err) => {
            console.log("error")
        })
    return productos
}

export const actualizarRegistro = async (coleccion, documento, data) => {
    let response = { statusresponse: false }

    await db.collection(coleccion).doc(documento).update(data)
        .then((resp) => response.statusresponse = true)
        .catch((err) => console.log(err))

    return response
}

export const eliminarProducto = async (coleccion, documento) => {
    let response = { statusresponse: false }

    await db.collection(coleccion).doc(documento)
        .delete()
        .then((res) => response.statusresponse = true)
        .catch((err) => console.log(err))

    return response
}

export const obtenerRegistroPorId = async (coleccion, documento) => {
    let response = { statusresponse: false, data: null }

    await db.collection(coleccion).doc(documento)
        .get()
        .then(res => {
            const producto = res.data()
            producto.id = res.id

            response.data = producto
            response.statusresponse = true
        })
        .catch(err => {
            console.log(err)
        })

    return response
}

export const ListarProductos = async () => {
    const productoslist = []
    let index = 0

    await db.collection("Productos")
        .where("status", "==", 1)
        .get()
        .then(resp => {
            resp.forEach((doc) => {
                const producto = doc.data()
                producto.id = doc.id
                productoslist.push(producto)
            })
        })
        .catch((err) => { console.log(err) })

    for (const registro of productoslist) {
        const usuario = await obtenerRegistroPorId("Usuarios", registro.usuario)
        productoslist[index].usuario = usuario.data
        index++
    }

    return productoslist
}