import React, { memo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { theme } from '../theme'

import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'

const Register = (props) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const { width } = Dimensions.get('window')

  const [hidePassword, setHidePassword] = useState(true)
  let [loginStatus, setLoginStatus] = useState('')
  let [loading, setLoading] = useState(false)
  let logo = require('../../assets/images/logo.png')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Background>
          <View style={{ marginTop: 40 }}>
            <Logo />
          </View>
          <View style={{ alignItems: 'center' }}>
            {loading == true && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            <Text
              style={{
                color: 'red',
                fontSize: Platform.OS == 'web' ? 20 : 12,
                marginBottom: 10,
              }}
            >
              {loginStatus}
            </Text>
          </View>
          <Header>Register</Header>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />

          <TextInput
            label="Confirm Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          
          <Button mode="contained" onPress={() => {
            props.onLogin();
          }}>
            Signup
          </Button>

          <TouchableOpacity>
            <Text style={styles.label}
              onPress={() => props.onLogin()}
            >
              Already have an account? Login
            </Text>
          </TouchableOpacity>

        </Background>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
    marginTop: 20,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default memo(Register)
