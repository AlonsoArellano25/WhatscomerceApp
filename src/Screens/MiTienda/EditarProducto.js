import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { Input, Image, Button, Icon, Avatar, AirbnbRating } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native'
import Loading from '../../Components/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { cargarImagenesxAspecto } from "../../Utils/Utils"
import { ObtenerUsuario, subirImagenesBatch, obtenerRegistroPorId, actualizarRegistro } from '../../Utils/Acciones';

export default function EditarProducto(props) {
    const { id } = props.route.params;
    const [titulo, setTitulo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState(0.0)
    const [imagenes, setImagenes] = useState([])
    const [categoria, setCategoria] = useState("")
    const [errores, setErrores] = useState({})
    const btnRef = useRef()
    const navigation = useNavigation()
    const [rating, setRating] = useState(5)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (
            async () => {
                const response = await obtenerRegistroPorId("Productos", id)
                const { data } = response
                setTitulo(data.titulo)
                setDescripcion(data.descripcion)
                setPrecio(data.precio)
                setImagenes(data.imagenes)
                setRating(data.rating)
                setCategoria(data.categoria)
            }
        )()
    }, [])

    const editProducto = async () => {
        setErrores({});
        if (isEmpty(titulo)) {
            setErrores({ titulo: "El campo titulo es obligatorio" })
        } else if (isEmpty(descripcion)) {
            setErrores({ descripcion: "El campo descripción es obligatorio" })
        } else if (!parseFloat(precio) > 0) {
            setErrores({ precio: "Introduzca un precio para el producto" })
        } else if (isEmpty(categoria)) {
            Alert.alert("Seleccione categoria", "Favor seleccione una categoria para el producto o servicio",
                [
                    {
                        style: "cancel",
                        text: "Entendido"
                    },
                ])
        } else if (isEmpty(imagenes)) {
            Alert.alert("Seleccione imagen", "Favor seleccione una imagen para el producto o servicio",
                [
                    {
                        style: "cancel",
                        text: "Entendido"
                    },
                ])
        } else {
            setLoading(true)
            const urlimagenes = await subirImagenesBatch(imagenes, "ImagenesProductos")
            const producto = {
                titulo,
                descripcion,
                precio,
                usuario: ObtenerUsuario().uid,
                imagenes: urlimagenes,
                status: 1,
                fechacreacion: new Date(),
                rating,
                categoria,
            }

            const registrarProducto = await actualizarRegistro("Productos", id, producto)

            if (registrarProducto.statusresponse) {
                setLoading(false)
                Alert.alert("Actualización completa", "El producto se ha actualizado correctamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.navigate("mitienda")
                    }])
            } else {
                setLoading(false)
                Alert.alert("Actualización fallido", "Ha ocurrido un error al actualizar el producto",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                    }])
            }
        }
    }


    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View
                style={{
                    borderBottomColor: "#25d366",
                    borderBottomWidth: 2,
                    width: 100,
                    marginTop: 20,
                    alignSelf: "center"
                }}
            />
            <Input
                placeholder="Titulo"
                onChangeText={(text) => setTitulo(text)}
                inputStyle={styles.input}
                errorMessage={errores.titulo}
                value={titulo}
            />
            <Input
                placeholder="Descripción"
                onChangeText={(text) => setDescripcion(text)}
                inputStyle={styles.textarea}
                errorMessage={errores.descripcion}
                multiline
                value={descripcion}
            />
            <Input
                placeholder="Precio"
                onChangeText={(text) => setPrecio(parseFloat(text))}
                inputStyle={styles.input}
                errorMessage={errores.precio}
                keyboardType="name-phone-pad"
                value={precio.toFixed(2)}
            />
            <Text style={styles.txtlabel}>Calidad del producto o servicio</Text>
            <AirbnbRating
                count={5}
                reviews={["Baja", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                defaultRating={5}
                size={35}
                onFinishRating={(value) => { setRating(value) }}
            />
            <Text style={styles.txtlabel}>Cargar imagenes</Text>
            <SubirImagenes imagenes={imagenes} setImagenes={setImagenes} />
            <Text style={styles.txtlabel}>Asignar categoria</Text>
            <Botonera categoria={categoria} setCategoria={setCategoria} />
            <Button
                title="Editar producto"
                buttonStyle={styles.btnaddnew}
                ref={btnRef}
                onPress={editProducto}
            />
            <Loading isVisible={loading} text="Por favor espere" />
        </KeyboardAwareScrollView>
    )
}

function SubirImagenes({ imagenes, setImagenes }) {
    const removerimagen = (imagen) => {
        Alert.alert("Eliminar imagen",
            "¿Estás seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImagenes(filter(imagenes, (imagenURL) => imagenURL !== imagen))
                    }
                }
            ])
    }
    return (
        <ScrollView style={styles.viewImagenes} horizontal showsHorizontalScrollIndicator={false}>
            {
                size(imagenes) < 5 && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={async () => {
                            const resultado = await cargarImagenesxAspecto([1, 1])
                            if (resultado.status) {
                                setImagenes([...imagenes, resultado.imagen])
                            }
                        }}
                    />
                )
            }
            {map(imagenes, (imagen, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatura}
                    source={{ uri: imagen }}
                    onPress={() => {
                        removerimagen(imagen)
                    }}
                />
            ))}
        </ScrollView>
    )
}

function Botonera({ categoria, setCategoria }) {
    return (
        <View style={styles.botonera}>
            <TouchableOpacity style={styles.btnCategoria} onPress={() => { setCategoria("libros") }}>
                <Icon
                    type="material-community"
                    name="book-open"
                    size={24}
                    color={categoria === "libros" ? "#128c7e" : "#757575"}
                    reverse
                />
                <Text>Libros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCategoria} onPress={() => { setCategoria("ideas") }}>
                <Icon
                    type="material-community"
                    name="lightbulb-on-outline"
                    size={24}
                    color={categoria === "ideas" ? "#128c7e" : "#757575"}
                    reverse
                />
                <Text>Ideas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCategoria} onPress={() => { setCategoria("articulos") }}>
                <Icon
                    type="material-community"
                    name="cart-arrow-down"
                    size={24}
                    color={categoria === "articulos" ? "#128c7e" : "#757575"}
                    reverse
                />
                <Text>Articulos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCategoria} onPress={() => { setCategoria("servicios") }}>
                <Icon
                    type="material-community"
                    name="account"
                    size={24}
                    color={categoria === "servicios" ? "#128c7e" : "#757575"}
                    reverse
                />
                <Text>Servicios</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 50,
        margin: 5,
        padding: 5,
        elevation: 3,
    },
    input: {
        width: "90%",
        borderRadius: 10,
        borderColor: "#707070",
        marginTop: 20,
        paddingHorizontal: 20,
        height: 50,
    },
    textarea: {
        height: 150,
    },
    txtlabel: {
        fontSize: 20,
        fontFamily: "Roboto",
        textAlign: "center",
        fontWeight: "bold",
        color: "#075e54",
    },
    btnaddnew: {
        backgroundColor: "#128c7e",
        marginTop: 20,
        marginBottom: 40,
        marginHorizontal: 20,
    },
    viewImagenes: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 10,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 150,
        width: 100,
        backgroundColor: "#e3e3e3",
        padding: 10,
    },
    miniatura: {
        width: 100,
        height: 150,
        marginRight: 10,
    },
    botonera: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    btnCategoria: {
        justifyContent: "center",
        alignItems: "center",
    }
})
