import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Alert } from 'react-native'
import { Avatar, Icon, Input, Button, Rating } from 'react-native-elements'
import { addRegistro, obtenerRegistroPorId, ObtenerUsuario, sendPushNotification, setMensajeNotificacion } from '../../Utils/Acciones'
import { size } from 'lodash'
import Loading from '../../Components/Loading'
import CarouselImages from '../../Components/Carousel'
import Modal from '../../Components/Modal'
import { enviarWhatsapp } from '../../Utils/Utils'

export default function Detalle(props) {
    const { id, titulo } = props.route.params

    const [producto, setProducto] = useState({})
    const [expopushtoken, setExpopushtoken] = useState("")
    const [nombrevendedor, setNombrevendedor] = useState("Nombre")
    const [photovendedor, setPhotovendedor] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [phonevendedor, setPhonevendedor] = useState("")
    const [activeslide, setActiveslide] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const usuarioactual = ObtenerUsuario()

    useEffect(() => {
        (async () => {
            setProducto((await obtenerRegistroPorId("Productos", id)).data)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (size(producto) > 0) {
                const resultado = (await obtenerRegistroPorId("Usuarios", producto.usuario)).data
                setExpopushtoken(resultado.token)
                setNombrevendedor(resultado.displayName)
                setPhotovendedor(resultado.photoURL)
                setPhonevendedor(resultado.phoneNumber)
            }

        })()
    }, [producto])

    if (producto.lenght !== 0) {
        return (
            <ScrollView style={styles.container}>
                <CarouselImages imagenes={producto.imagenes} height={400} width={Dimensions.get("window").width} activeslide={activeslide} setActiveslide={setActiveslide} />
                <View style={styles.boxSuperior}>
                    <View style={{ borderBottomColor: "#25d366", borderBottomWidth: 2, width: 100, alignSelf: "center" }} />
                    <Text style={styles.titulo}>{producto.titulo}</Text>
                    <Text style={styles.precio}>S/.{parseFloat(producto.precio).toFixed(2)}</Text>

                    <View>
                        <Text style={styles.descripcion}>{producto.descripcion}</Text>
                        <Rating
                            imageSize={20}
                            startingValue={producto.rating}
                            readonly
                        />
                    </View>
                    <Text style={styles.titulo}>Contactar al anunciante</Text>
                    <View style={styles.avatarbox}>
                        <Avatar
                            source={photovendedor ? { uri: photovendedor } : require("../../../assets/avatar.jpg")}
                            style={styles.avatar}
                            rounded
                            size="large"
                        />
                        <View>
                            <Text style={styles.displayName}>
                                {nombrevendedor ? nombrevendedor : "Anónimo"}
                            </Text>
                            <View style={styles.boxinternalavatar}>
                                <Icon
                                    type="material-community"
                                    name="message-text-outline"
                                    color="#25d366"
                                    size={40}
                                    onPress={() => {
                                        setIsVisible(true)
                                    }}
                                />
                                <Icon
                                    type="material-community"
                                    name="whatsapp"
                                    color="#25d366"
                                    size={40}
                                    onPress={() => {
                                        const mensajewhatsapp = `Estimado ${nombrevendedor}, mi nombre es ${usuarioactual.displayName} me interesa el producto ${producto.titulo} que esta en WhatsComerce`
                                        enviarWhatsapp(phonevendedor, mensajewhatsapp)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <EnviarMensaje isVisible={isVisible} setIsVisible={setIsVisible} nombrevendedor={nombrevendedor} avatarvendedor={photovendedor} mensaje={mensaje} setMensaje={setMensaje} receiver={producto.usuario} sender={usuarioactual.uid} token={expopushtoken} producto={producto} setLoading={setLoading} nombrecliente={usuarioactual.displayName} />
                    <Loading isVisible={loading} text="Enviando el mensaje..." />
                </View>
            </ScrollView>
        )
    }

}

function EnviarMensaje({ isVisible, setIsVisible, nombrevendedor, avatarvendedor, mensaje, setMensaje, receiver, sender, token, producto, setLoading, nombrecliente }) {

    const enviarNotificacion = async () => {
        if (!mensaje) {
            Alert.alert("Validación", "Favor introduce un texto para el mensaje", [
                {
                    style: "default",
                    text: "Entendido",
                }
            ])
        } else {
            setLoading(true)
            const notificacion = {
                sender: sender,
                receiver: receiver,
                mensaje,
                fechacreacion: new Date(),
                productoid: producto.id,
                productotitulo: producto.titulo,
                visto: 0,
            }

            const resultado = await addRegistro("Notificaciones", notificacion)
            if (resultado.statusresponse) {

                const mensajenotificacion = setMensajeNotificacion(token, `Cliente interesado - ${producto.titulo}`,
                    `${nombrecliente} te ha enviado un mensaje`,
                    { data: "Prospecto interesado" });

                const respuesta = await sendPushNotification(mensajenotificacion)
                setLoading(false)

                if (respuesta) {
                    Alert.alert("Acción realizada correctamente", "Se ha enviado el mensaje correctamente", [
                        {
                            style: 'cancel',
                            text: 'Entendido',
                            onPress: () => setIsVisible(false)
                        }
                    ])
                    setMensaje("")
                } else {

                    Alert.alert("Error", "Se ha producido un error al enviar el mensaje", [
                        {
                            style: 'cancel',
                            text: 'Entendido',
                        }
                    ])
                    setLoading(false)
                }

            }
        }
    }

    return (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                fontSize: 16,
                borderRadius: 20,
            }} >
                <Avatar
                    source={avatarvendedor ? { uri: avatarvendedor } : require("../../../assets/avatar.jpg")}
                    style={styles.photovendor}
                />
                <Text style={{ color: "#075e54", fontSize: 16, fontWeight: "bold" }}>
                    Enviale un mensaje a {nombrevendedor}
                </Text>
                <Input
                    placeholder="Escribe un mensaje"
                    multiline={true}
                    inputStyle={styles.textarea}
                    onChangeText={(text) => setMensaje(text)}
                    value={mensaje}
                />
                <Button
                    title="Enviar mensaje"
                    buttonStyle={styles.btnsend}
                    containerStyle={{ width: "90%" }}
                    onPress={enviarNotificacion}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    boxSuperior: {
        backgroundColor: "#fff",
        marginTop: -50,
        paddingTop: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    titulo: {
        color: "#075e54",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    precio: {
        fontSize: 18,
        color: "#128c7e",
        fontWeight: "bold",
        paddingLeft: 10,
    },
    descripcion: {
        fontWeight: "300",
        fontSize: 16,
        alignSelf: "center",
        paddingHorizontal: 10,
        marginVertical: 10,
        color: "#757575",
        textAlign: "center",
    },
    avatarbox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
        flex: 1,
    },
    avatar: {
        width: 60,
        height: 60
    },
    boxinternalavatar: {
        justifyContent: "center",
        flexDirection: "row"
    },
    displayName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#075e54"
    },
    photovendor: {
        width: 60,
        height: 60,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    textarea: {
        height: 150,
    },
    btnsend: {
        backgroundColor: "#075e54"
    }
})
