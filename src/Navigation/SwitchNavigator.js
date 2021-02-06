import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';
import RutasAutenticadas from './RutasAutenticadas';
import CuentaStack from './CuentaStack';
import { validarPhone } from '../Utils/Acciones';

export default function SwitchNavigator() {
    const [phoneAuth, setPhoneAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validarPhone(setPhoneAuth);
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }, [])

    if (loading) {
        return <Loading isVisible={loading} text="Cargando configuración" />
    } else {
        return phoneAuth ? <RutasAutenticadas /> : <CuentaStack />
    }

}