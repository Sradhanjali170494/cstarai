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
import {  CREATE_SPONSOR, UPLOAD_FILE } from './../../../services/queries';

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();   

    const initialValues =
    {
        sponsorCompanyName: '',
        sponsorContactTitle: '',
        sponsorContactFirstName:  '',
        sponsorContactLastName:  '',
        sponsorContactEmail:  '',
        sponsorContactPhone: '',
        sponsorStatus: 'pending',
        sponsorAddress1: '',
        sponsorAddress2: '',
        sponsorCountry: 'USA',
        sponsorState: '',
        sponsorZip: '',
        sponsorLogo: [],
        sponsorBanner: [],
    }

    const validationSchema = Yup.object().shape({
        sponsorCompanyName: Yup.string().required(config.sponsorCompanyNameValidation),
        sponsorContactTitle: Yup.string().required(config.sponsorContactTitleValidation),
        sponsorContactFirstName: Yup.string().required(config.sponsorContactFirstNameValidation),
        sponsorContactLastName: Yup.string().required(config.sponsorContactLastNameValidation),
        sponsorContactEmail: Yup.string().required(config.sponsorContactEmailValidation).email(config.sponsorContactEmailMatchingValidation),
        sponsorContactPhone: Yup.string().required(config.sponsorContactPhoneValidation).matches(config.phoneNumberMatching, config.sponsorContactPhoneMatchingValidation),
        sponsorStatus: Yup.string().required(config.sponsorStatusValidation),
        sponsorAddress1: Yup.string().required(config.sponsorAddress1Validation),
        sponsorAddress2: Yup.string().required(config.sponsorAddress2Validation),
        sponsorCountry: Yup.string().required(config.sponsorCountryValidation),
        sponsorState: Yup.string().required(config.sponsorStateValidation),
        sponsorZip: Yup.string().required(config.sponsorZipValidation),
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
        const sponsorData = trimValues(formData);
        sponsorData.sponsorContactPhone = getNumber(sponsorData.sponsorContactPhone);
        handleCreateSponsor(sponsorData);
    }

    const [createSponsor] = useMutation(CREATE_SPONSOR);

    const handleCreateSponsor = async (sponsorData) => {
        try {
            const result = await createSponsor({
                variables: {
                    companyName: sponsorData.sponsorCompanyName, 
                    title: sponsorData.sponsorContactTitle,   
                    firstName: sponsorData.sponsorContactFirstName,
                    lastName: sponsorData.sponsorContactLastName,
                    email: sponsorData.sponsorContactEmail,   
                    phone: sponsorData.sponsorContactPhone,                      
                    status: sponsorData.sponsorStatus,               
                    address1: sponsorData.sponsorAddress1,
                    address2: sponsorData.sponsorAddress2,
                    country: sponsorData.sponsorCountry,
                    state: sponsorData.sponsorState,
                    zip: sponsorData.sponsorZip,
                    logo: sponsorData.sponsorLogo,
                    banner: sponsorData.sponsorBanner,
                }
            });

            if (result.data.createSponsor.sponsor_id) {    
                alert('Sponsor Added Successfully');
                setTimeout(() => {
                    router.push("home/sponsors")
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating Sponsor:', error.message);
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
                                        label={config.sponsorCompanyNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorCompanyName}
                                        onChangeText={formik.handleChange('sponsorCompanyName')}
                                        onBlur={formik.handleBlur('sponsorCompanyName')}
                                        error={!!formik.errors.sponsorCompanyName}
                                        errorText={formik.errors.sponsorCompanyName}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorContactTitleLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorContactTitle}
                                        onChangeText={formik.handleChange('sponsorContactTitle')}
                                        onBlur={formik.handleBlur('sponsorContactTitle')}
                                        error={!!formik.errors.sponsorContactTitle}
                                        errorText={formik.errors.sponsorContactTitle}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorContactFirstNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorContactFirstName}
                                        onChangeText={formik.handleChange('sponsorContactFirstName')}
                                        onBlur={formik.handleBlur('sponsorContactFirstName')}
                                        error={!!formik.errors.sponsorContactFirstName}
                                        errorText={formik.errors.sponsorContactFirstName}
                                    />
                                </View>
                                                                       
                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorContactLastNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorContactLastName}
                                        onChangeText={formik.handleChange('sponsorContactLastName')}
                                        onBlur={formik.handleBlur('sponsorContactLastName')}
                                        error={!!formik.errors.sponsorContactLastName}
                                        errorText={formik.errors.sponsorContactLastName}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorContactEmailLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorContactEmail}
                                        onChangeText={formik.handleChange('sponsorContactEmail')}
                                        onBlur={formik.handleBlur('sponsorContactEmail')}
                                        error={!!formik.errors.sponsorContactEmail}
                                        errorText={formik.errors.sponsorContactEmail}
                                    />
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorContactPhoneLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorContactPhone}
                                        onChangeText={handlePhoneChange('sponsorContactPhone')}
                                        onBlur={formik.handleBlur('sponsorContactPhone')}
                                        error={!!formik.errors.sponsorContactPhone}
                                        errorText={formik.errors.sponsorContactPhone}
                                        keyboardType="numeric"
                                    />
                                </View>

                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.sponsorStatus}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('sponsorStatus')}
                                    >
                                        <Picker.Item label={config.sponsorStatusLabel} value="" />
                                        {status.map((option, index) => (
                                            <Picker.Item key={index} label={capitalizeWords(option.name)} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.sponsorStatus && (
                                        <Text style={styles.errorText}>{formik.errors.sponsorStatus}</Text>
                                    )}
                                </View>    

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorAddress1Label}
                                        returnKeyType="next"
                                        value={formik.values.sponsorAddress1}
                                        onChangeText={formik.handleChange('sponsorAddress1')}
                                        onBlur={formik.handleBlur('sponsorAddress1')}
                                        error={!!formik.errors.sponsorAddress1}
                                        errorText={formik.errors.sponsorAddress1}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorAddress2Label}
                                        returnKeyType="next"
                                        value={formik.values.sponsorAddress2}
                                        onChangeText={formik.handleChange('sponsorAddress2')}
                                        onBlur={formik.handleBlur('sponsorAddress2')}
                                        error={!!formik.errors.sponsorAddress2}
                                        errorText={formik.errors.sponsorAddress2}
                                    />
                                </View>                             
                                                           
                            </View>

                            <View style={styles.inputRow}>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.sponsorCountry}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('sponsorCountry')}
                                    >
                                        <Picker.Item label={config.sponsorCountryLabel} value="" />
                                        {countries.map((option, index) => (
                                            <Picker.Item key={index} label={option.name} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.sponsorCountry && (
                                        <Text style={styles.errorText}>{formik.errors.sponsorCountry}</Text>
                                    )}
                                </View> 

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorStateLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorState}
                                        onChangeText={formik.handleChange('sponsorState')}
                                        onBlur={formik.handleBlur('sponsorState')}
                                        error={!!formik.errors.sponsorState}
                                        errorText={formik.errors.sponsorState}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.sponsorZipLabel}
                                        returnKeyType="next"
                                        value={formik.values.sponsorZip}
                                        onChangeText={handleZipChange('sponsorZip')}
                                        onBlur={formik.handleBlur('sponsorZip')}
                                        error={!!formik.errors.sponsorZip}
                                        errorText={formik.errors.sponsorZip}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('sponsorLogo')} >
                                        {config.sponsorLogoLabel}
                                    </Button>
                                    {formik.errors.sponsorLogo && (
                                        <Text style={styles.errorText}>{formik.errors.sponsorLogo}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.sponsorLogo && 
                                            formik.values.sponsorLogo.map((item, index) => {
                                                return <Image source={config.apiUrl.replace('/graphql', '/uploads/')+item}  key={index} style={styles.image} />
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                            

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('sponsorBanner')} >
                                        {config.sponsorBannerLabel}
                                    </Button>
                                    {formik.errors.sponsorBanner && (
                                        <Text style={styles.errorText}>{formik.errors.sponsorBanner}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.sponsorBanner && 
                                            formik.values.sponsorBanner.map((item, index) => {
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