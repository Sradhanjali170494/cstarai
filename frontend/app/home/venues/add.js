import React, { useCallback } from 'react';
import TextInput from '../../components/TextInput';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../theme';
import { trimValues, formatPhoneNumber, getNumber, capitalizeWords} from '../../utils';
import { useRouter } from "expo-router";
import { countries, status } from '../../../assets/api.json';
import * as config from '../../../constants';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from "react-redux";

import {
    View,
    Text,
    StyleSheet,
    Platform,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native'

import {
    Button
} from 'react-native-paper'

import { useFocusEffect } from '@react-navigation/native';
import {  useMutation } from '@apollo/client';
import {  CREATE_VENUE, UPLOAD_FILE } from './../../../services/queries';

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();   

    const initialValues =
    {
        venueName: '',
        venueCompanyName: '',                
        venueContactFirstName:  '',
        venueContactLastName:  '',
        venueContactEmail:  '',
        venueContactPhone: '',
        venueStatus: 'pending',
        venueAddress1: '',
        venueAddress2: '',
        venueCountry: 'USA',
        venueState: '',
        venueZip: '',
        venueLogo: [],
        venueBanner: [],
    }

    const validationSchema = Yup.object().shape({
        venueName: Yup.string().required(config.venueNameValidation),
        venueCompanyName: Yup.string().required(config.venueCompanyNameValidation),  
        venueContactFirstName: Yup.string().required(config.venueContactFirstNameValidation),
        venueContactLastName: Yup.string().required(config.venueContactLastNameValidation),
        venueContactEmail: Yup.string().required(config.venueContactEmailValidation).email(config.venueContactEmailMatchingValidation),
        venueContactPhone: Yup.string().required(config.venueContactPhoneValidation).matches(config.phoneNumberMatching, config.venueContactPhoneMatchingValidation),
        venueStatus: Yup.string().required(config.venueStatusValidation),
        venueAddress1: Yup.string().required(config.venueAddress1Validation),
        venueAddress2: Yup.string().required(config.venueAddress2Validation),
        venueCountry: Yup.string().required(config.venueCountryValidation),
        venueState: Yup.string().required(config.venueStateValidation),
        venueZip: Yup.string().required(config.venueZipValidation),
    });
   
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            formSubmit(values);
        },
    });
    
    useFocusEffect(
        useCallback(() => {
            authRedirect();
            formik.resetForm();
        }, [])
    );
    
    const authRedirect = () => {
        if(!isAuth){
            setTimeout(() => {
                router.push("logout")
            }, 100);
        } 
    }

    const handleZipChange = (field) => text => {
        const numericText = text.replace(config.zipFormatting, '');
        if (numericText.length <= config.zipMaximumLength) {
            formik.setFieldValue(field, numericText);
        }
    };

    const handlePhoneChange = (field) => text => {
        const phoneText = formatPhoneNumber(text);      
        if (phoneText.length <= config.phoneNumberMaximumLength) {
            formik.setFieldValue(field, phoneText);
        }
    }; 

    const formSubmit = (formData) => {
        const venueData = trimValues(formData);
        venueData.venueContactPhone = getNumber(venueData.venueContactPhone);
        handleCreateVenue(venueData);
    }

    const [createVenue] = useMutation(CREATE_VENUE);

    const handleCreateVenue = async (venueData) => {
        try {
            const result = await createVenue({
                variables: {                   
                    venueName: venueData.venueName,   
                    companyName: venueData.venueCompanyName, 
                    firstName: venueData.venueContactFirstName,
                    lastName: venueData.venueContactLastName,
                    email: venueData.venueContactEmail,   
                    phone: venueData.venueContactPhone,                      
                    status: venueData.venueStatus,               
                    address1: venueData.venueAddress1,
                    address2: venueData.venueAddress2,
                    country: venueData.venueCountry,
                    state: venueData.venueState,
                    zip: venueData.venueZip,
                    logo: venueData.venueLogo,
                    banner: venueData.venueBanner,
                }
            });

            if (result.data.createVenue.venue_id) {    
                alert('Venue Added Successfully');
                setTimeout(() => {
                    router.push("home/venues")
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating Venue:', error);
            if(error.message){
                alert(error.message);
            }
        }
    };

    const [uploadFile] = useMutation(UPLOAD_FILE);

    const handleChooseImage = async (field) => {
        launchImageLibrary(config.imageOptions, async (response) => {
          if (response.didCancel) {
            console.log(config.imagePickerCancelled);
          } else if (response.error) {
            console.log(config.imagePickerError, response.error);
          } else if (response.assets && response.assets[0]) {

            const files = response.assets.map(asset => ({
                uri: asset.uri
            }));

            try {
                const result =  await uploadFile({
                    variables: { files },
                });

                let uploadedFiles = [];
                if (result.data.uploadFile.success) {
                    uploadedFiles = result.data.uploadFile.files;
                    formik.setFieldValue(field, uploadedFiles); 
                } else {                    
                    console.log('Error', result.data.uploadFile.message);
                    formik.setFieldValue(field, uploadedFiles); 
                }
            } catch (error) {
                console.log('Error uploading file:', error);
            }

          }
        });
    }; 

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <View
                        style={{
                            flexDirection: Platform.OS == 'web' ? 'row' : 'column',
                            width: Platform.OS == 'web' ? '90%' : '90%',
                            alignSelf: 'center',
                        }}
                    >
                        <View>
                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueName}
                                        onChangeText={formik.handleChange('venueName')}
                                        onBlur={formik.handleBlur('venueName')}
                                        error={!!formik.errors.venueName}
                                        errorText={formik.errors.venueName}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueCompanyNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueCompanyName}
                                        onChangeText={formik.handleChange('venueCompanyName')}
                                        onBlur={formik.handleBlur('venueCompanyName')}
                                        error={!!formik.errors.venueCompanyName}
                                        errorText={formik.errors.venueCompanyName}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueContactFirstNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueContactFirstName}
                                        onChangeText={formik.handleChange('venueContactFirstName')}
                                        onBlur={formik.handleBlur('venueContactFirstName')}
                                        error={!!formik.errors.venueContactFirstName}
                                        errorText={formik.errors.venueContactFirstName}
                                    />
                                </View>
                                                                       
                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueContactLastNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueContactLastName}
                                        onChangeText={formik.handleChange('venueContactLastName')}
                                        onBlur={formik.handleBlur('venueContactLastName')}
                                        error={!!formik.errors.venueContactLastName}
                                        errorText={formik.errors.venueContactLastName}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueContactEmailLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueContactEmail}
                                        onChangeText={formik.handleChange('venueContactEmail')}
                                        onBlur={formik.handleBlur('venueContactEmail')}
                                        error={!!formik.errors.venueContactEmail}
                                        errorText={formik.errors.venueContactEmail}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueContactPhoneLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueContactPhone}
                                        onChangeText={handlePhoneChange('venueContactPhone')}
                                        onBlur={formik.handleBlur('venueContactPhone')}
                                        error={!!formik.errors.venueContactPhone}
                                        errorText={formik.errors.venueContactPhone}
                                        keyboardType="numeric"
                                    />
                                </View>

                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.venueStatus}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('venueStatus')}
                                    >
                                        <Picker.Item label={config.venueStatusLabel} value="" />
                                        {status.map((option, index) => (
                                            <Picker.Item key={index} label={capitalizeWords(option.name)} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.venueStatus && (
                                        <Text style={styles.errorText}>{formik.errors.venueStatus}</Text>
                                    )}
                                </View>    

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueAddress1Label}
                                        returnKeyType="next"
                                        value={formik.values.venueAddress1}
                                        onChangeText={formik.handleChange('venueAddress1')}
                                        onBlur={formik.handleBlur('venueAddress1')}
                                        error={!!formik.errors.venueAddress1}
                                        errorText={formik.errors.venueAddress1}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueAddress2Label}
                                        returnKeyType="next"
                                        value={formik.values.venueAddress2}
                                        onChangeText={formik.handleChange('venueAddress2')}
                                        onBlur={formik.handleBlur('venueAddress2')}
                                        error={!!formik.errors.venueAddress2}
                                        errorText={formik.errors.venueAddress2}
                                    />
                                </View>                             
                                                           
                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.venueCountry}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('venueCountry')}
                                    >
                                        <Picker.Item label={config.venueCountryLabel} value="" />
                                        {countries.map((option, index) => (
                                            <Picker.Item key={index} label={option.name} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.venueCountry && (
                                        <Text style={styles.errorText}>{formik.errors.venueCountry}</Text>
                                    )}
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueStateLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueState}
                                        onChangeText={formik.handleChange('venueState')}
                                        onBlur={formik.handleBlur('venueState')}
                                        error={!!formik.errors.venueState}
                                        errorText={formik.errors.venueState}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.venueZipLabel}
                                        returnKeyType="next"
                                        value={formik.values.venueZip}
                                        onChangeText={handleZipChange('venueZip')}
                                        onBlur={formik.handleBlur('venueZip')}
                                        error={!!formik.errors.venueZip}
                                        errorText={formik.errors.venueZip}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('venueLogo')} >
                                        {config.venueLogoLabel}
                                    </Button>
                                    {formik.errors.venueLogo && (
                                        <Text style={styles.errorText}>{formik.errors.venueLogo}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.venueLogo && 
                                            formik.values.venueLogo.map((item, index) => {
                                                return <Image source={config.apiUrl.replace('/graphql', '/uploads/')+item}  key={index} style={styles.image} />
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                            

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('venueBanner')} >
                                        {config.venueBannerLabel}
                                    </Button>
                                    {formik.errors.venueBanner && (
                                        <Text style={styles.errorText}>{formik.errors.venueBanner}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.venueBanner && 
                                            formik.values.venueBanner.map((item, index) => {
                                                return <Image source={config.apiUrl.replace('/graphql', '/uploads/')+item}  key={index} style={styles.image} />
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                            

                            <View>
                                <Button mode="contained" buttonColor="#000" style={styles.saveBtn} textColor='#fff' onPress={formik.handleSubmit} >
                                    <Text style={styles.saveBtnTxt}>{config.saveButtonLabel}</Text>
                                </Button>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
    },
    imagesRow: {
        flexDirection: 'row',  
    },
    inputContainer: {
        marginHorizontal: 20
    },
    errorText: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 0,
    },
    saveBtn: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
        textAlign: 'center',
        alignSelf: 'center'
    },
    saveBtnTxt: {
        paddingHorizontal: 50
    },
    pickerDropdown: {
        border: 0,
        marginTop: 20,
        marginBottom: 5,
        height: 50,
        paddingHorizontal: 60
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        marginHorizontal:10
    },
    imageBtn: {
        marginVertical:10
    },
})