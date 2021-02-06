import React, { useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Icon } from 'react-native-elements'

export default function InputEditable({ label, placeholder, onChangeInput, obtenerValor, id, editable, seteditable, actualizarValor }) {


    const editar = () => {
        seteditable(!editable)
    }

    return (
        <View style={styles.input}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.row}>
                <TextInput
                    key={id}
                    style={styles.textinputinteral}
                    placeholder={placeholder}
                    value={obtenerValor(id)}
                    onChangeText={(text) => { onChangeInput(id, text) }}
                />
                {
                    editable ? (
                        <Icon
                            name="content-save"
                            type="material-community"
                            size={24}
                            onPress={
                                () => {
                                    actualizarValor(id, obtenerValor(id))
                                    editar()
                                }
                            }
                            style={styles.icon}
                        />
                    )
                        :
                        (
                            <Icon
                                name="pencil"
                                type="material-community"
                                size={24}
                                style={styles.icon}
                                onPress={editar}
                            />
                        )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 10,
        color: "#128c7e",
        fontSize: 16,
    },
    textinputinteral: {
        fontSize: 18,
        width: "90%",

    },
    input: {
        borderBottomColor: "#cecece",
        borderBottomWidth: 1,
        width: "100%",
        marginBottom: 10,
        paddingHorizontal: 10,
    }
})
