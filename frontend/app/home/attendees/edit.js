import React, { useCallback, useState } from 'react';
import TextInput from '../../components/TextInput';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../theme';
import { trimValues, formatPhoneNumber, getNumber, capitalizeWords} from '../../utils';
import { useRouter } from "expo-router";
import { countries, status } from '../../../assets/api.json';
import * as config from '../../../constants';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRoute, useFocusEffect } from '@react-navigation/native';
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

import { useQuery, useMutation } from '@apollo/client';
import { GET_ATTENDEE_DATA, UPDATE_ATTENDEE, UPLOAD_FILE  } from './../../../services/queries';

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const route = useRoute();
    const router = useRouter();
    const attendeeId = route.params.id;
    const [attendeeDet, setAttendeeDet] = useState(false);  

    const initialValues =
    {
        attendeeFirstName:'',
        attendeeLastName: '',
        attendeeEmail: '',
        attendeeCompanyName: '',
        attendeeStatus: 'pending',
        attendeeTitle: '',
        attendeeAddress1: '',
        attendeeAddress2: '',
        attendeeCountry: 'USA',
        attendeeState: '',
        attendeeZip: '',
        attendeePhone: '',
        attendeeProfilePhoto: [],
        attendeeBanner: []
    }

    const validationSchema = Yup.object().shape({
        attendeeFirstName: Yup.string().required(config.attendeeFirstNameValidation),
        attendeeLastName: Yup.string().required(config.attendeeLastNameValidation),
        attendeeEmail: Yup.string().required(config.attendeeEmailValidation).email(config.attendeeEmailMatchingValidation),
        attendeeCompanyName: Yup.string().required(config.attendeeCompanyNameValidation),
        attendeeStatus: Yup.string().required(config.attendeeStatusValidation),
        attendeeTitle: Yup.string().required(config.attendeeTitleValidation),
        attendeeAddress1: Yup.string().required(config.attendeeAddress1Validation),
        attendeeAddress2: Yup.string().required(config.attendeeAddress2Validation),
        attendeeCountry: Yup.string().required(config.attendeeCountryValidation),
        attendeeState: Yup.string().required(config.attendeeStateValidation),
        attendeeZip: Yup.string().required(config.attendeeZipValidation),
        attendeePhone: Yup.string().required(config.attendeePhoneValidation).matches(config.phoneNumberMatching, config.attendeePhoneMatchingValidation),
    });
   
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            formSubmit(values);
        },
    });
    

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

    const { error, data, refetch } = useQuery(GET_ATTENDEE_DATA, {
        variables: { id: attendeeId }
    }); 

    useFocusEffect(
        useCallback(() => {
            if(!isAuth){
                setTimeout(() => {
                    router.push("logout")
                }, 100);
            } else {
                formik.resetForm();          
                setAttendeeDet(true);
                fetchData(refetch);
            }   
        }, [data, refetch, attendeeDet, error])
    );

    const fetchData = async (refetch) => {
        try {
            await refetch();
            if (data) {          
                const attendeeDetails = data.getAttendee;   

                const getAttendeeProfilePhoto = attendeeDetails?.profile_photo ? attendeeDetails?.profile_photo : [];
                const getAttendeeBanner = attendeeDetails?.banner ? attendeeDetails?.banner : [];
                
                const updatedFormValues =
                {
                    attendeeFirstName: attendeeDetails?.first_name,
                    attendeeLastName: attendeeDetails?.last_name,
                    attendeeEmail: attendeeDetails?.email,
                    attendeeCompanyName: attendeeDetails?.company_name, 
                    attendeeStatus: attendeeDetails?.status,
                    attendeeTitle: attendeeDetails?.title,   
                    attendeeAddress1: attendeeDetails?.address1,
                    attendeeAddress2: attendeeDetails?.address2,
                    attendeeCountry: attendeeDetails?.country,
                    attendeeState: attendeeDetails?.state,
                    attendeeZip: attendeeDetails?.zip,
                    attendeePhone: attendeeDetails?.phone?formatPhoneNumber(attendeeDetails?.phone) : '',
                    attendeeProfilePhoto: getAttendeeProfilePhoto,
                    attendeeBanner: getAttendeeBanner,
                }
                formik.setValues(updatedFormValues);                                   
                setAttendeeDet(true);
            }
        } catch (error) {
            console.error('Error fetching attendee data:', error.message);
            if(error.message){
                alert(error.message);
            }
            router.push("home/attendees");
        }
    };


    const formSubmit = (formData) => {
        const attendeeData = trimValues(formData);
        attendeeData.attendeePhone = getNumber(attendeeData.attendeePhone);
        handleUpdateAttendee(attendeeData);
    }

    const [updateAttendee] = useMutation(UPDATE_ATTENDEE);

    const handleUpdateAttendee = async (attendeeData) => {
        try {
            const result = await updateAttendee({
                variables: {
                    id: attendeeId,
                    firstName: attendeeData.attendeeFirstName,
                    lastName: attendeeData.attendeeLastName,
                    email: attendeeData.attendeeEmail,
                    companyName: attendeeData.attendeeCompanyName, 
                    status: attendeeData.attendeeStatus,
                    title: attendeeData.attendeeTitle,   
                    address1: attendeeData.attendeeAddress1,
                    address2: attendeeData.attendeeAddress2,
                    country: attendeeData.attendeeCountry,
                    state: attendeeData.attendeeState,
                    zip: attendeeData.attendeeZip,
                    phone: attendeeData.attendeePhone,
                    profilePhoto: attendeeData.attendeeProfilePhoto,
                    banner: attendeeData.attendeeBanner,
                }
            });

            if (result.data.updateAttendee.attendee_id) {    
                alert('Attendee Updated Successfully');
                setTimeout(() => {
                    router.push("home/attendees")
                }, 1000);
            }
        } catch (error) {
            console.error('Error updating attendee:', error.message);
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
        (attendeeDet &&
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
                                            label={config.attendeeFirstNameLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeFirstName}
                                            onChangeText={formik.handleChange('attendeeFirstName')}
                                            onBlur={formik.handleBlur('attendeeFirstName')}
                                            error={!!formik.errors.attendeeFirstName}
                                            errorText={formik.errors.attendeeFirstName}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeLastNameLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeLastName}
                                            onChangeText={formik.handleChange('attendeeLastName')}
                                            onBlur={formik.handleBlur('attendeeLastName')}
                                            error={!!formik.errors.attendeeLastName}
                                            errorText={formik.errors.attendeeLastName}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeEmailLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeEmail}
                                            onChangeText={formik.handleChange('attendeeEmail')}
                                            onBlur={formik.handleBlur('attendeeEmail')}
                                            error={!!formik.errors.attendeeEmail}
                                            errorText={formik.errors.attendeeEmail}
                                        />
                                    </View>                                        
                                </View>

                                <View style={styles.inputRow}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeCompanyNameLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeCompanyName}
                                            onChangeText={formik.handleChange('attendeeCompanyName')}
                                            onBlur={formik.handleBlur('attendeeCompanyName')}
                                            error={!!formik.errors.attendeeCompanyName}
                                            errorText={formik.errors.attendeeCompanyName}
                                        />
                                    </View>
                                
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formik.values.attendeeStatus}
                                            style={styles.pickerDropdown}
                                            onValueChange={formik.handleChange('attendeeStatus')}
                                        >
                                            <Picker.Item label={config.attendeeStatusLabel} value="" />
                                            {status.map((option, index) => (
                                                <Picker.Item key={index} label={capitalizeWords(option.name)} value={option.name} />
                                            ))}
                                        </Picker>
                                        {formik.errors.attendeeStatus && (
                                            <Text style={styles.errorText}>{formik.errors.attendeeStatus}</Text>
                                        )}
                                    </View>    

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeTitleLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeTitle}
                                            onChangeText={formik.handleChange('attendeeTitle')}
                                            onBlur={formik.handleBlur('attendeeTitle')}
                                            error={!!formik.errors.attendeeTitle}
                                            errorText={formik.errors.attendeeTitle}
                                        />
                                    </View>      

                                </View>

                                <View style={styles.inputRow}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeAddress1Label}
                                            returnKeyType="next"
                                            value={formik.values.attendeeAddress1}
                                            onChangeText={formik.handleChange('attendeeAddress1')}
                                            onBlur={formik.handleBlur('attendeeAddress1')}
                                            error={!!formik.errors.attendeeAddress1}
                                            errorText={formik.errors.attendeeAddress1}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeAddress2Label}
                                            returnKeyType="next"
                                            value={formik.values.attendeeAddress2}
                                            onChangeText={formik.handleChange('attendeeAddress2')}
                                            onBlur={formik.handleBlur('attendeeAddress2')}
                                            error={!!formik.errors.attendeeAddress2}
                                            errorText={formik.errors.attendeeAddress2}
                                        />
                                    </View>
                                
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formik.values.attendeeCountry}
                                            style={styles.pickerDropdown}
                                            onValueChange={formik.handleChange('attendeeCountry')}
                                        >
                                            <Picker.Item label={config.attendeeCountryLabel} value="" />
                                            {countries.map((option, index) => (
                                                <Picker.Item key={index} label={option.name} value={option.name} />
                                            ))}
                                        </Picker>
                                        {formik.errors.attendeeCountry && (
                                            <Text style={styles.errorText}>{formik.errors.attendeeCountry}</Text>
                                        )}
                                    </View>                             
                                </View>

                                <View style={styles.inputRow}>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeStateLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeState}
                                            onChangeText={formik.handleChange('attendeeState')}
                                            onBlur={formik.handleBlur('attendeeState')}
                                            error={!!formik.errors.attendeeState}
                                            errorText={formik.errors.attendeeState}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeeZipLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeeZip}
                                            onChangeText={handleZipChange('attendeeZip')}
                                            onBlur={formik.handleBlur('attendeeZip')}
                                            error={!!formik.errors.attendeeZip}
                                            errorText={formik.errors.attendeeZip}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            label={config.attendeePhoneLabel}
                                            returnKeyType="next"
                                            value={formik.values.attendeePhone}
                                            onChangeText={handlePhoneChange('attendeePhone')}
                                            onBlur={formik.handleBlur('attendeePhone')}
                                            error={!!formik.errors.attendeePhone}
                                            errorText={formik.errors.attendeePhone}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputRow}>     
                                    <View style={styles.inputContainer}>    
                                        <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('attendeeBanner')} >
                                            {config.attendeeBannerLabel}
                                        </Button>
                                        {formik.errors.attendeeBanner && (
                                            <Text style={styles.errorText}>{formik.errors.attendeeBanner}</Text>
                                        )}
                                    </View>
                                    <View style={styles.inputContainer}>  
                                        <View style={styles.imagesRow}>                                    
                                            {formik.values.attendeeBanner && 
                                                formik.values.attendeeBanner.map((item, index) => {
                                                    return <Image source={config.apiUrl.replace('/graphql', '/uploads/')+item}  key={index} style={styles.image} />
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.inputRow}>     
                                    <View style={styles.inputContainer}>    
                                        <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('attendeeProfilePhoto')} >
                                            {config.attendeeProfilePhotoLabel}
                                        </Button>
                                        {formik.errors.attendeeProfilePhoto && (
                                            <Text style={styles.errorText}>{formik.errors.attendeeProfilePhoto}</Text>
                                        )}
                                    </View>
                                    <View style={styles.inputContainer}>  
                                        <View style={styles.imagesRow}>                                    
                                            {formik.values.attendeeProfilePhoto && 
                                                formik.values.attendeeProfilePhoto.map((item, index) => {
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