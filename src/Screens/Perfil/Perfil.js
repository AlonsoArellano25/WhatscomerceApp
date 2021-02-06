import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { Icon, Avatar, Input } from 'react-native-elements'
import { subirImagenesBatch, addRegistroEspecifico, actualizarPerfil, ObtenerUsuario, enviarautenticacionphone, reauntenticar, actualizarEmailfirebase, actualizarTelefono } from '../../Utils/Acciones'
import { cargarImagenesxAspecto, validateEmail } from '../../Utils/Utils'
import Loading from '../../Components/Loading'
import InputEditable from '../../Components/InputEditable'
import CodeInput from 'react-native-code-input'
import FirebaseRecapcha from '../../Utils/FirebaseRecapcha'
import Modal from '../../Components/Modal'
import { Alert } from 'react-native'

export default function Perfil() {

    const [imagenPerfil, setImagenPerfil] = useState("")
    const [loading, setLoading] = useState(false)
    const [displayName, setDisplayName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [editableName, setEditableName] = useState(false)
    const [editableEmail, setEditableEmail] = useState(false)
    const [editablePhone, setEditablePhone] = useState(false)
    const [verificationid, setVerificationid] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const usuario = ObtenerUsuario()
    const recapcha = useRef()
    const [updatephone, setUpdatephone] = useState(false)

    useEffect(() => {
        setImagenPerfil(usuario.photoURL)
        const { displayName, phoneNumber, email } = usuario
        setDisplayName(displayName)
        setPhoneNumber(phoneNumber)
        setEmail(email)
    }, [])

    const onChangeInput = (input, valor) => {
        switch (input) {
            case "displayName":
                setDisplayName(valor)
                break;
            case "email":
                setEmail(valor)
                break;
            case "phoneNumber":
                setPhoneNumber(valor)
                break;
            default:
                break;
        }
    }

    const obtenerValor = (input) => {
        switch (input) {
            case "displayName":
                return displayName;
                break;
            case "email":
                return email;
                break;
            case "phoneNumber":
                return phoneNumber;
                break;
            default:
                break;
        }
    }

    const actualizarValor = async (input, valor) => {
        switch (input) {
            case "displayName":
                console.log(await actualizarPerfil({ displayName: valor }))
                addRegistroEspecifico("Usuarios", usuario.uid, { displayName: valor })
                console.log(usuario)
                break;
            case "email":
                if (valor !== usuario.email) {
                    if (validateEmail(valor)) {
                        const verification = await enviarautenticacionphone(phoneNumber, recapcha)
                        if (verification) {
                            setVerificationid(verification)
                            setIsVisible(true)
                        } else {
                            alert("Ha ocurrido un error en la verificación")
                            setEmail(usuario.email)
                        }
                    }
                }
                break;
            case "phoneNumber":
                console.log(valor)
                console.log(usuario.phoneNumber)
                if (valor !== usuario.phoneNumber) {

                    const verification = await enviarautenticacionphone(phoneNumber, recapcha)
                    if (verification) {
                        setVerificationid(verification)
                        setUpdatephone(true)
                        setIsVisible(true)
                    } else {
                        alert("Ha ocurrido un error en la verificación")
                        setPhoneNumber(usuario.phoneNumber)
                    }
                    break;
                }

            default:
                break;
        }
    }

    const ConfirmarCodigo = async (verificacionid, code) => {
        setLoading(true)
        if (updatephone) {
            const telefono = await actualizarTelefono(verificacionid, code)
            const updateregistro = await addRegistroEspecifico(
                "Usuarios",
                usuario.uid,
                { phoneNumber: phoneNumber }
            )
            setUpdatephone(false)
            setLoading(false)
            setIsVisible(false)
        } else {
            const resultado = await reauntenticar(verificacionid, code)
            if (resultado.statusresponse) {
                const emailresponse = await actualizarEmailfirebase(email)
                const updateregistro = await addRegistroEspecifico("Usuarios", usuario.uid, { email: email })
                console.log(emailresponse)
                console.log(updateregistro)
                setLoading(false)
                setIsVisible(false)
            } else {
                alert("Ha ocurrido un error al actualizar el correo")
                setLoading(false)
                setIsVisible(false)
            }
        }

    }

    return (
        <View>
            <StatusBar backgroundColor="#128c7e" />
            <CabeceraBG nombre={usuario.displayName} />
            <HeaderAvatar usuario={usuario} imagenPerfil={imagenPerfil} setImagenPerfil={setImagenPerfil} setLoading={setLoading} />
            <FormDatos
                onChangeInput={onChangeInput}
                obtenerValor={obtenerValor}
                editableEmail={editableEmail}
                editableName={editableName}
                editablePhone={editablePhone}
                setEditableEmail={setEditableEmail}
                setEditableName={setEditableName}
                setEditablePhone={setEditablePhone}
                actualizarValor={actualizarValor}
            />
            <ModalVerification
                isVisibleModal={isVisible}
                setIsVisibleModal={setIsVisible}
                verificationid={verificationid}
                ConfirmarCodigo={ConfirmarCodigo}
            />
            <FirebaseRecapcha referencia={recapcha} />
            <Loading isVisible={loading} text="Por favor espere" />
        </View>
    )
}

function HeaderAvatar({ usuario, imagenPerfil, setImagenPerfil, setLoading }) {
    const cambiarFoto = async () => {
        const resultado = await cargarImagenesxAspecto([1, 1])
        if (resultado.status) {
            setLoading(true)
            const url = await subirImagenesBatch([resultado.imagen], "Perfil")
            const update = await actualizarPerfil({ photoURL: url[0] })
            const response = await addRegistroEspecifico("Usuarios", usuario.uid, { photoURL: url[0] })
            if (response.statusresponse) {
                setImagenPerfil(url[0])
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
    return (
        <View style={styles.avatarinline}>
            <Avatar
                source={imagenPerfil ? { uri: imagenPerfil } : require('../../../assets/avatar.jpg')}
                style={styles.avatar}
                size="large"
                rounded
                showAccessory={true}
                onAccessoryPress={cambiarFoto}
            />
        </View>
    )
}

function CabeceraBG({ nombre }) {
    return (
        <View>
            <View style={styles.bg}>
                <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}
                >
                    {nombre}
                </Text>
            </View>
        </View>
    )
}

function FormDatos({ actualizarValor, onChangeInput, obtenerValor, editableEmail, editableName, editablePhone, setEditableEmail, setEditableName, setEditablePhone }) {
    return (
        <View>
            <InputEditable
                id="displayName"
                label="Nombre"
                obtenerValor={obtenerValor}
                placeholder="Nombre"
                onChangeInput={onChangeInput}
                editable={editableName}
                seteditable={setEditableName}
                actualizarValor={actualizarValor}
            />
            <InputEditable
                id="email"
                label="Correo"
                obtenerValor={obtenerValor}
                placeholder="ejemplo@ejemplo.com"
                onChangeInput={onChangeInput}
                editable={editableEmail}
                seteditable={setEditableEmail}
                actualizarValor={actualizarValor}
            />
            <InputEditable
                id="phoneNumber"
                label="Teléfono"
                obtenerValor={obtenerValor}
                placeholder="+000000"
                onChangeInput={onChangeInput}
                editable={editablePhone}
                seteditable={setEditablePhone}
                actualizarValor={actualizarValor}
            />
        </View>
    )
}

function ModalVerification({ isVisibleModal, setIsVisibleModal, ConfirmarCodigo, verificationid }) {
    return (
        <Modal isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
            <View style={styles.confirmacion}>
                <Text style={styles.tituloModal}>Confirmar código</Text>
                <Text style={styles.detalle}>Se ha enviado un código de verificación a su número de teléfono</Text>
                <CodeInput
                    activeColor="#128c7e"
                    inactiveColor="#128c7e"
                    autoFocus={true}
                    inputPosition="center"
                    size={40}
                    codeLength={6}
                    containerStyle={{ marginTop: 30 }}
                    codeInputStyle={{ borderWidth: 1.5 }}
                    secureTextEntry
                    onFulfill={
                        (code) => {
                            ConfirmarCodigo(verificationid, code)
                        }
                    }
                />
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    bg: {
        width: "100%",
        height: 200,
        borderBottomLeftRadius: 200,
        borderBottomRightRadius: 200,
        backgroundColor: "#128c7e",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarinline: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: -70,
    },
    avatar: {
        width: 80,
        height: 80,

    },
    confirmacion: {
        height: 200,
        width: "100%",
        alignItems: "center",
    },
    tituloModal: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 20,
    },
    detalle: {
        marginTop: 20,
        fontSize: 14,
        textAlign: "center"
    }
})
