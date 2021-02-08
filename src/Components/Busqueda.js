import React, { useEffect } from 'react'
import { SearchBar } from 'react-native-elements'
import { Buscar } from '../Utils/Acciones'

export default function Busqueda({ setProductList, actualizarProductos, setSearch, search, setMensajes }) {

    useEffect(() => {
        let resultados = []
        if (search) {
            (async () => {
                resultados = await Buscar(search)
                setProductList(resultados)
                if (resultados.length === 0) {
                    setMensajes("No se encontraron datos para la busqueda " + search)
                }
            })()
        }
    }, [search])

    return (
        <SearchBar
            placeholder="¿Qué estas buscando?"
            containerStyle={{ backgroundColor: "transparent", borderTopColor: "transparent", borderBottomColor: "transparent" }}
            inputContainerStyle={{ backgroundColor: "#fff", alignItems: "center" }}
            inputStyle={{ fontFamily: "Roboto", fontSize: 20 }}
            onChangeText={(text) => {
                setSearch(text)
            }}
            value={search}
            onClear={() => {
                setSearch("")
                setProductList([])
                actualizarProductos()
            }}
        />
    )
}
