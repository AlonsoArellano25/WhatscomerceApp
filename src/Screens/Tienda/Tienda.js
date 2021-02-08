import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { Icon, Avatar, Image, Rating, Badge } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { size } from "lodash"
import { ListarProductos, ObtenerUsuario, ListarProductosPorCategoria, Buscar, ListarNotificaciones } from '../../Utils/Acciones'
import Busqueda from '../../Components/Busqueda'
import { set } from 'react-native-reanimated'

export default function Tienda() {
    const navigation = useNavigation()
    const [productList, setProductList] = useState([])
    const [search, setSearch] = useState("")
    const [mensajes, setMensajes] = useState("Cargando...")
    const [notificaciones, setNotificaciones] = useState(0)
    const { photoURL } = ObtenerUsuario()
    const [categoria, setCategoria] = useState("")



    useFocusEffect(
        useCallback(() => {
            (async () => {
                setNotificaciones(0)
                setProductList(await ListarProductos())

                const consulta = await ListarNotificaciones()
                if (consulta.statusresponse) {
                    setNotificaciones(size(consulta.data))
                    console.log(size(consulta.data))
                }
            })()
        }, [])
    )

    const cargarFiltroPorCategoria = async (categoria) => {
        const listaproductos = await ListarProductosPorCategoria(categoria)
        setProductList(listaproductos)
        if (listaproductos.length === 0) {
            setMensajes("No se encontraron datos para la categoria " + categoria)
        }
    }

    const actualizarProductos = async () => {
        setProductList(await ListarProductos())
    }

    return (
        < View style={styles.frame}>
            <StatusBar backgroundColor="#128c7e" />
            <View style={styles.header}>
                <KeyboardAwareScrollView>
                    <View style={styles.menu}>
                        <Avatar
                            rounded
                            size="medium"
                            source={photoURL ? { uri: photoURL } : require("../../../assets/avatar.jpg")}
                            onPress={() => navigation.toggleDrawer()}
                        />
                        <Image
                            source={require("../../../assets/logo.png")}
                            style={styles.logo}
                        />
                        <View>
                            <Icon
                                type="material-community"
                                name="bell-outline"
                                color="#fff"
                                size={30}
                                onPress={() => { navigation.navigate("mensajes") }}
                            />
                            {notificaciones > 0 && (
                                <Badge
                                    status="error"
                                    containerStyle={{ position: "absolute", top: -4, right: -4 }}
                                    value={notificaciones}
                                />
                            )}

                        </View>
                    </View>
                    <Busqueda
                        setProductList={setProductList}
                        actualizarProductos={actualizarProductos}
                        setSearch={setSearch}
                        search={search}
                        setMensajes={setMensajes}
                    />
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.categoriaView}>
                <View style={styles.titulocategoria}>
                    <Text style={styles.categoriatext}> - CATEGORIAS - </Text>
                    {
                        categoria.length > 0 && (
                            <TouchableOpacity onPress={() => { setCategoria(""); actualizarProductos() }}>
                                <Icon
                                    type="material-community"
                                    color="red"
                                    name="close"
                                    reverse
                                    size={10}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={styles.categorialist}>
                    <BotonCategoria categoriaboton="libros" categoria={categoria} icon="book-open-outline" texto="Libros" setCategoria={setCategoria} cargarFiltroPorCategoria={cargarFiltroPorCategoria} />
                    <BotonCategoria categoriaboton="ideas" categoria={categoria} icon="lightbulb-on-outline" texto="Ideas" setCategoria={setCategoria} cargarFiltroPorCategoria={cargarFiltroPorCategoria} />
                    <BotonCategoria categoriaboton="articulos" categoria={categoria} icon="cart-arrow-down" texto="Articulos" setCategoria={setCategoria} cargarFiltroPorCategoria={cargarFiltroPorCategoria} />
                    <BotonCategoria categoriaboton="servicios" categoria={categoria} icon="account-outline" texto="Servicios" setCategoria={setCategoria} cargarFiltroPorCategoria={cargarFiltroPorCategoria} />
                </View>
            </View>
            {size(productList) > 0 ? (
                <FlatList
                    data={productList}
                    renderItem={(producto) => (
                        <Producto producto={producto} navigation={navigation} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                    <Text>{mensajes}</Text>
                )}
        </View >
    )
}

function Producto({ producto, navigation }) {
    const { titulo, descripcion, precio, imagenes, rating, id, usuario } = producto.item
    const { displayName, photoURL } = usuario
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("detalle", { id, titulo })}>
            <Image
                source={{ uri: imagenes[0] }}
                style={styles.imgProducto}
            />
            <View style={styles.infobox}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text>{descripcion.substring(0, 50)}</Text>
                <Text style={styles.vendidopor}>Vendido por </Text>
                <View style={styles.avatarbox}>
                    <Avatar
                        source={photoURL ? { uri: photoURL } : require("../../../assets/avatar.jpg")}
                        rounded
                        size="large"
                        style={styles.avatar}
                    />
                    <Text style={styles.displayname}>{displayName}</Text>
                </View>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    style={{ paddingLeft: 40 }}
                    readonly
                />
                <Text style={styles.precio}>S/.{precio.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )
}

function BotonCategoria({ categoriaboton, categoria, icon, texto, setCategoria, cargarFiltroPorCategoria }) {
    return (
        <TouchableOpacity
            style={categoria === categoriaboton ? styles.categoriahover : styles.categoriabtn}
            onPress={() => { setCategoria(categoriaboton); cargarFiltroPorCategoria(categoriaboton) }}
        >
            <Icon
                type="material-community"
                name={icon}
                size={30}
                color={categoria === categoriaboton ? "#fff" : "#128c7e"}
            />
            <Text style={categoria === categoriaboton ? styles.cattxthover : styles.cattxt}>{texto}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: "#fff",

    },
    header: {
        height: "20%",
        width: "100%",
        backgroundColor: "#128c7e",
    },
    menu: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    logo: {
        width: 50,
        height: 50
    },
    card: {
        width: "100%",
        paddingVertical: 20,
        flex: 1,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderBottomColor: "#128c7e",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    imgProducto: {
        width: 150,
        height: 200,
        borderRadius: 10,
    },
    infobox: {
        paddingLeft: 10,
        alignItems: "center",
        flex: 1,
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        color: "#075e54",
    },
    vendidopor: {
        fontSize: 16,
        marginTop: 5,
        color: "#075e54",
        fontWeight: "700",
    },
    avatarbox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    avatar: {
        width: 30,
        height: 30,
    },
    displayname: {
        marginLeft: 10,
    },
    precio: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: "bold",
        color: "#128c7e",
        alignSelf: "center",
    },
    categoriahover: {
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 7.0,
            height: -8.0,
        },
        shadowOpacity: 0.5,
        shadowColor: "#000",
        backgroundColor: "#25d366",
        borderRadius: 40,
        elevation: 1,
    },
    categoriabtn: {
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 7.0,
            height: -8.0,
        },
        shadowOpacity: 0.5,
        shadowColor: "#000",
        backgroundColor: "#fff",
        borderRadius: 40,
        elevation: 1,
    },
    cattxthover: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#fff",
    },
    cattxt: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#128c7e",
    },
    categoriaView: {
        marginTop: 10,
    },
    titulocategoria: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    categoriatext: {
        color: "#128c7e",
        fontSize: 14,
        fontWeight: "bold",
    },
    categorialist: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingTop: 5,
    }
})
