import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from 'react-native'
import { size } from "lodash";

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email) === false) {
        return false
    } else {
        return true
    }
}

export const cargarImagenesxAspecto = async (array) => {
    let imgResponse = { status: false, imagen: "" };
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "denied") {
        alert("Usted debe permitir el accesos para cargar las imagenes");
    } else {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: array,
        });

        if (!result.cancelled) {
            imgResponse = { status: true, imagen: result.uri };
        }
    }
    return imgResponse;
};

export const convertirFicherBlob = async (rutaFisica) => {
    const fichero = await fetch(rutaFisica);
    const blob = await fichero.blob();
    return blob;
}

export const enviarWhatsapp = (numero, text) => {
    let link = `whatsapp://send?phone=${numero.substring(1, size(numero))}&text=${text}`
    Linking.canOpenURL(link)
        .then((supp) => {
            if (!supp) {
                Alert.alert("Favor instale whatsapp para enviar un mensaje directo")
            } else {
                return Linking.openURL(link)
            }
        })
}