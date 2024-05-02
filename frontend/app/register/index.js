import React, {useCallback} from 'react';
import { useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";

import {
    View,
    StyleSheet
  } from 'react-native'

import Register from '../components/Register'

export default function Page() {
  const isAuth = useSelector(state => state.auth.isLoggedIn);
  const router=useRouter();

  useFocusEffect(
      useCallback(() => {
          authRedirect();
      }, [])
  );

  const authRedirect = () => {
      if(isAuth){
          setTimeout(() => {
              router.push("home")
          }, 100);
      } 
  }

  return (
    <View style={styles.container}>
        <Register onRegister={()=>{
            router.navigate("home");
        }} onLogin={()=>{
            router.push("/");
        }} />
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    }
  });