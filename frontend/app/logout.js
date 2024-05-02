import { View, Text } from 'react-native';
import React, { useCallback } from 'react';
import { authActions } from "./../store/auth";
import { useDispatch } from "react-redux"
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

export default function Page() {
    const router = useRouter();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
          authRedirect();
        }, [])
    );

    const authRedirect = () => {
      dispatch(authActions.onLogout());
      router.navigate("/");
    }
}
