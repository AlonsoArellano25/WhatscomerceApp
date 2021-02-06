import React from 'react'
import { View, Text } from 'react-native'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from './Firebase'

import Constants from 'expo-constants'

export default function FirebaseRecapcha({ referencia }) {
    return (
        <FirebaseRecaptchaVerifierModal
            ref={referencia}
            title="Confirma que no eres un robot"
            cancelLabel="x"
            firebaseConfig={firebaseConfig}
        />
    )
}
