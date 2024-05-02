import React, { useCallback } from 'react';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import DatePicker from '../../components/datePickerInput';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../theme';
import { trimValues, dateConversion } from '../../utils';
import { useRouter } from "expo-router";
import { countries, timezones } from '../../../assets/api.json';
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
import { useMutation } from '@apollo/client';
import { CREATE_EVENT, UPLOAD_FILE } from './../../../services/queries';

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();

    const initialValues =
    {
        eventName: '',
        eventStartDate: '',
        eventEndDate: '',
        eventLocation: '',
        eventTimezone: '',
        eventAddress1: '',
        eventAddress2: '',
        eventCountry: '',
        eventState: '',
        eventZip: '',
        eventDescription: '',
        eventBanner: [],
        eventThumbnail: []
    }

    const validationSchema = Yup.object().shape({
        eventName: Yup.string().required(config.eventNameValidation),
        eventStartDate: Yup.string().required(config.eventStartDateValidation),
        eventEndDate: Yup.string().required(config.eventEndDateValidation),
        eventLocation: Yup.string().required(config.eventLocationValidation),
        eventTimezone: Yup.string().required(config.eventTimezoneValidation),
        eventAddress1: Yup.string().required(config.eventAddress1Validation),
        eventAddress2: Yup.string().required(config.eventAddress2Validation),
        eventCountry: Yup.string().required(config.eventCountryValidation),
        eventState: Yup.string().required(config.eventStateValidation),
        eventZip: Yup.string().required(config.eventZipValidation),
        eventDescription: Yup.string().required(config.eventDescriptionValidation)
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

    const handleDate = (field) => text => {
        formik.setFieldValue(field, text);
    };

    const formSubmit = (formData) => {
        const eventData = trimValues(formData);
        eventData.eventStartDate = dateConversion(eventData.eventStartDate);
        eventData.eventEndDate = dateConversion(eventData.eventEndDate);
        handleCreateEvent(eventData);
    }

    const [createEvent] = useMutation(CREATE_EVENT);

    const handleCreateEvent = async (eventData) => {
        try {
            const result = await createEvent({
                variables: {
                    eventName: eventData.eventName,
                    eventStartDate: eventData.eventStartDate,
                    eventEndDate: eventData.eventEndDate,
                    eventLocation: eventData.eventLocation,
                    eventTimezone: eventData.eventTimezone,
                    eventAddress1: eventData.eventAddress1,
                    eventAddress2: eventData.eventAddress2,
                    eventCountry: eventData.eventCountry,
                    eventState: eventData.eventState,
                    eventZip: eventData.eventZip,
                    eventDescription: eventData.eventDescription,
                    eventBanner: eventData.eventBanner,
                    eventThumbnail: eventData.eventThumbnail,
                }
            });

            if (result.data.createEvent.event_id) {
                alert('Event Added Successfully');
                setTimeout(() => {
                    router.push("home/events")
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
            if (error.message) {
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
                                        label={config.eventNameLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventName}
                                        onChangeText={formik.handleChange('eventName')}
                                        onBlur={formik.handleBlur('eventName')}
                                        error={!!formik.errors.eventName}
                                        errorText={formik.errors.eventName}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <DatePicker
                                        label={config.eventStartDateLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventStartDate}
                                        onChange={handleDate('eventStartDate')}
                                        onBlur={formik.handleBlur('eventStartDate')}
                                        error={!!formik.errors.eventStartDate}
                                        errorText={formik.errors.eventStartDate}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <DatePicker
                                        label={config.eventEndDateLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventEndDate}
                                        onChange={handleDate('eventEndDate')}
                                        onBlur={formik.handleBlur('eventEndDate')}
                                        error={!!formik.errors.eventEndDate}
                                        errorText={formik.errors.eventEndDate}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.eventLocationLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventLocation}
                                        onChangeText={formik.handleChange('eventLocation')}
                                        onBlur={formik.handleBlur('eventLocation')}
                                        error={!!formik.errors.eventLocation}
                                        errorText={formik.errors.eventLocation}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.eventTimezone}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('eventTimezone')}
                                    >
                                        <Picker.Item label={config.eventTimezoneLabel} value="" />
                                        {timezones.map((option, index) => (
                                            <Picker.Item key={index} label={option.name} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.eventTimezone && (
                                        <Text style={styles.errorText}>{formik.errors.eventTimezone}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.eventAddress1Label}
                                        returnKeyType="next"
                                        value={formik.values.eventAddress1}
                                        onChangeText={formik.handleChange('eventAddress1')}
                                        onBlur={formik.handleBlur('eventAddress1')}
                                        error={!!formik.errors.eventAddress1}
                                        errorText={formik.errors.eventAddress1}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.eventAddress2Label}
                                        returnKeyType="next"
                                        value={formik.values.eventAddress2}
                                        onChangeText={formik.handleChange('eventAddress2')}
                                        onBlur={formik.handleBlur('eventAddress2')}
                                        error={!!formik.errors.eventAddress2}
                                        errorText={formik.errors.eventAddress2}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Picker
                                        selectedValue={formik.values.eventCountry}
                                        style={styles.pickerDropdown}
                                        onValueChange={formik.handleChange('eventCountry')}
                                    >
                                        <Picker.Item label={config.eventCountryLabel} value="" />
                                        {countries.map((option, index) => (
                                            <Picker.Item key={index} label={option.name} value={option.name} />
                                        ))}
                                    </Picker>
                                    {formik.errors.eventCountry && (
                                        <Text style={styles.errorText}>{formik.errors.eventCountry}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.eventStateLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventState}
                                        onChangeText={formik.handleChange('eventState')}
                                        onBlur={formik.handleBlur('eventState')}
                                        error={!!formik.errors.eventState}
                                        errorText={formik.errors.eventState}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={config.eventZipLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventZip}
                                        onChangeText={handleZipChange('eventZip')}
                                        onBlur={formik.handleBlur('eventZip')}
                                        error={!!formik.errors.eventZip}
                                        errorText={formik.errors.eventZip}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={styles.inputContainer}>
                                    <TextArea
                                        label={config.eventDescriptionLabel}
                                        returnKeyType="next"
                                        value={formik.values.eventDescription}
                                        onChangeText={formik.handleChange('eventDescription')}
                                        onBlur={formik.handleBlur('eventDescription')}
                                        error={!!formik.errors.eventDescription}
                                        errorText={formik.errors.eventDescription}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('eventBanner')} >
                                        {config.eventBannerLabel}
                                    </Button>
                                    {formik.errors.eventBanner && (
                                        <Text style={styles.errorText}>{formik.errors.eventBanner}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.eventBanner && 
                                            formik.values.eventBanner.map((item, index) => {
                                                return <Image source={config.apiUrl.replace('/graphql', '/uploads/')+item}  key={index} style={styles.image} />
                                            })
                                        }
                                    </View>
                                </View>

                            </View>

                            <View style={styles.inputRow}>     
                                <View style={styles.inputContainer}>    
                                    <Button icon="image" mode="contained" buttonColor ="#000" style={styles.imageBtn} textColor='#fff' onPress={() => handleChooseImage('eventThumbnail')} >
                                        {config.eventThumbnailLabel}
                                    </Button>
                                    {formik.errors.eventThumbnail && (
                                        <Text style={styles.errorText}>{formik.errors.eventThumbnail}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>  
                                    <View style={styles.imagesRow}>                                    
                                        {formik.values.eventThumbnail && 
                                            formik.values.eventThumbnail.map((item, index) => {
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
        marginVertical: 20,
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