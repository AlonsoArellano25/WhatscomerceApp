import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import Loading from './src/Components/Loading';
import RutasNoAutenticadas from './src/Navigation/RutasNoAutenticadas'
import SwitchNavigator from './src/Navigation/SwitchNavigator'
import { validarSesion } from './src/Utils/Acciones';
import { encode, decode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreAllLogs()


export default function App() {
  const [user, setUser] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    validarSesion(setUser)
    setLoading(false)
  }, [])
  if (loading) {
    return <Loading isVisible={loading} text="Cargando..." />
  }
  return user ? <SwitchNavigator /> : <RutasNoAutenticadas />

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
