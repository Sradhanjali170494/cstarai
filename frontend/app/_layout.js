
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink  } from '@apollo/client';
import * as config from '../constants';
import store from './../store';

const httpLink = createHttpLink({
    uri: config.apiUrl,
});

// Initialize Apollo Client
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default function _layout() {    
    const router=useRouter();
    return (       
        <Provider store={store}>
            <ApolloProvider client={client}>
                <PaperProvider>
                    <Stack screenOptions={{
                        headerStyle: {
                            backgroundColor: 'purple',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}>
                        <Stack.Screen name="index" options={{
                            headerShown: false
                        }} />
                        <Stack.Screen name="register/index" options={{
                            header: () => null
                        }} />   
                        <Stack.Screen name="home" options={{
                            headerShown: true,
                            title: 'C-STAR Control Panel',
                            headerRight: () => (
                                <Button
                                    onPress={()=>{
                                        router.navigate("logout");
                                    }}
                                    title="Logout"
                                    color="#000"
                                    marginRight="100px"
                                />
                            ),  
                        }} />
                    </Stack>
                </PaperProvider>
            </ApolloProvider>
        </Provider>
    );
}