import React, { memo, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,    
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { theme } from '../theme'

import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useFormik } from 'formik';
import * as Yup from "yup";
import {  useMutation } from '@apollo/client';
import { LOGIN } from './../../services/queries';
import * as config from '../../constants';
import { trimValues } from '../utils';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { useRouter } from "expo-router";

const Login = (props) => {
  const isAuth = useSelector(state => state.auth.isLoggedIn);
  const router=useRouter();
  const dispatch = useDispatch();
  let [loginStatus, setLoginStatus] = useState('')
  let [loading, setLoading] = useState(false)

  const initialValues =
  {
    email:'',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(config.emailValidation).email(config.emailMatchingValidation),
    password: Yup.string().required(config.passwordValidation),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      setLoginStatus('');
      const formData = trimValues(values);
      handleLogin(formData);
    },
  });

  useFocusEffect(
      useCallback(() => {
          authRedirect();
          formik.resetForm();
      }, [])
  );

  const authRedirect = () => {
      if(isAuth){
          setTimeout(() => {
              router.push("home")
          }, 100);
      } 
  }

  const [login] = useMutation(LOGIN);

  const handleLogin = async (loginData) => {
    try {
        const result = await login({
            variables: {
                email: loginData.email,
                password: loginData.password
            }
        });
        setLoading(false);
        if (result.data.login.sessionId) {
            const userDetails = result.data.login;
            const loggedinDetails = {            
              sessionId: userDetails.sessionId,
              userId: userDetails.user.user_id,
              username: userDetails.user.user_name,
              email: userDetails.user.email
            };
            dispatch(authActions.onLogin(loggedinDetails));
            props.onLogin();
        }
    } catch (error) {      
      setLoading(false);
      setLoginStatus('Invalid Login');
    }
  };

  const handleChange = (field) => text => {
    formik.setFieldValue(field, text); 
    setLoginStatus(''); 
  };

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
          <Header>Login</Header>

            <TextInput
              label={config.emailLabel}
              returnKeyType="next"
              value={formik.values.email}
              onChangeText={handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={!!formik.errors.email}
              errorText={formik.errors.email}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          
            <TextInput
                label={config.passwordLabel}
                returnKeyType="next"
                value={formik.values.password}
                onChangeText={handleChange('password')}
                onBlur={formik.handleBlur('password')}
                error={!!formik.errors.password}
                errorText={formik.errors.password}
                secureTextEntry
            />

            <Button mode="contained" onPress={formik.handleSubmit}>Login</Button>
          
            <TouchableOpacity>
              <Text style={styles.label}
                onPress={() => props.onRegister()}
              >
                Don't have an account? Sign Up
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
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 0,
  },
})

export default memo(Login)
