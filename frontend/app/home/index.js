import { View, Image, StyleSheet } from 'react-native';
import React, {useCallback} from 'react';
import { useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            authRedirect();
        }, [])
    );

    const authRedirect = () => {
        if(!isAuth){
            setTimeout(() => {
                router.push("logout")
            }, 100);
        } 
    }

    return (
        <View style={styles.container}> 
           <Image
                source={require('./../../assets/images/dashboard.png')}
                style={styles.dahboardImg}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    dahboardImg: {
        width: 500,
        height: 500
    },
})