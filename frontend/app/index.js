import React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import Login from './components/Login'
import { useRouter } from 'expo-router';
export default function Page() {
  const router=useRouter();
  return (
      <View style={styles.container}>
          <Login onLogin={()=>{
              router.navigate("home");
          }} onRegister={()=>{
              router.navigate("register");
          }}/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  }
});