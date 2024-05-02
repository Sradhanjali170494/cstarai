import React, { useState, useCallback } from 'react';
import { capitalizeWords, formatPhoneNumber } from '../../utils';
import CustomPagination from '../../components/CustomPagination';
import DeleteDialog from '../../components/deleteDialog';
import { useRouter } from 'expo-router';
import { theme } from '../../theme';
import * as config from '../../../constants';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_ATTENDEES, DELETE_ATTENDEE  } from './../../../services/queries';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from "react-redux";

import {
    View,
    Text,
    StyleSheet,
    Platform,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native'

import {
    DataTable,
    Searchbar,
    IconButton,
    Button
} from 'react-native-paper'

export default function Page() {
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();
    const [attendees, setAttendees] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [attendeeId, setAttendeeId] = useState(0)
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [deletePromptVisible, setDeletePromptVisible] = useState(false)
    const itemsPerPage = config.itemsPerPage;

    const numberOfPages = Math.ceil(totalCount / itemsPerPage);
    const offset = page*itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, totalCount);

     
    const showDeleteDialog = (id) => {
        setDeletePromptVisible(true)
        setAttendeeId(id);
    }

    const hideDeleteDialog = () => {
        setDeletePromptVisible(false)
        setAttendeeId(0);
    }

    const deleteData = () => {
        setDeletePromptVisible(false);
        handleDeleteAttendee(attendeeId);       
        setAttendeeId(0);
    }

    const { loading, error, data, refetch } = useQuery(GET_ALL_ATTENDEES, {      
        variables: { search: search, limit:itemsPerPage, offset:offset },
    });

    useFocusEffect(
        useCallback(() => {
          authRedirect();
          fetchData(refetch);
        }, [refetch, search, data, page])
    );

    const authRedirect = () => {
        if(!isAuth){
            setTimeout(() => {
                router.push("logout")
            }, 100);
        } 
    }

    const fetchData = async (refetch) => {
        try {
            await refetch();
            if(data){
                const responseData = data.getAllAttendees;
                setAttendees(responseData.attendees);
                setTotalCount(responseData.totalCount);
            }
        } catch (error) {
            console.error('Error fetching attendee data:', error.message);
            if(error.message){
                alert(error.message);
            }
        }
    };    

    const [deleteAttendee] = useMutation(DELETE_ATTENDEE);

    const handleDeleteAttendee = async (attendeeId) => {
        try {
            await deleteAttendee({
                variables: { id: attendeeId },
            });
            fetchData(refetch);
        } catch (error) {
            console.error('Error deleting attendee:', error.message);
            if(error.message){
                alert(error.message);
            }
        }
    };

    const editData = (id) => {
       router.push({ pathname: '/home/attendees/edit', params: { id: id } });
    }

    const searchData = (text) => {
        setPage(0);
        setSearch(text)
    }

    const status = (val) => {
        const statusColor = (val == "approved") ? "green" : "red";
        return (
            <Text style={{ color: statusColor, 'fontWeight': 600 }}>{capitalizeWords(val)}</Text>
        )
    }

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
                        <View style={{ flex: 4 }}>
                            <Searchbar
                                style={styles.searchBtn}
                                iconColor="#fff"
                                placeholderTextColor="#fff"
                                placeholder="Search"
                                value={search}
                                onChangeText={(text) => searchData(text)}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Button icon="plus" mode="contained" buttonColor ="#000" style={styles.addBtn} textColor='#fff' onPress={() => router.push("home/attendees/add")} >
                                Add New Attendee
                            </Button>
                        </View>

                    </View>
                    <View style={styles.maintable}>
                        {!loading ? (
                            (!error ? (
                                <DataTable style={{ backgroundColor: '#fff' }}>
                                    <DataTable.Header>
                                        <DataTable.Title textStyle={styles.headerTitles}>Name</DataTable.Title>
                                        <DataTable.Title textStyle={styles.headerTitles}>Email</DataTable.Title>
                                        <DataTable.Title textStyle={styles.headerTitles}>Phone</DataTable.Title>
                                        <DataTable.Title textStyle={styles.headerTitles}>Status</DataTable.Title>
                                        <DataTable.Title textStyle={styles.headerTitles}>Manage</DataTable.Title>
                                    </DataTable.Header>
                                    {
                                        attendees && (attendees.length > 0) ? (   
                                            attendees.map((item) => {
                                                return (
                                                    <DataTable.Row key={item.attendee_id}>
                                                        <DataTable.Cell textStyle={styles.cellItems}>{capitalizeWords(item.first_name + ' ' + item.last_name)}</DataTable.Cell>
                                                        <DataTable.Cell textStyle={styles.cellItems}>{item.email}</DataTable.Cell>
                                                        <DataTable.Cell textStyle={styles.cellItems}>{formatPhoneNumber(item.phone)}</DataTable.Cell>
                                                        <DataTable.Cell textStyle={styles.cellItems}>{status(item.status)}</DataTable.Cell>
                                                        {Platform.OS == 'web' ? (
                                                            <DataTable.Cell>
                                                                <IconButton
                                                                    icon="pencil"     
                                                                    mode="contained"
                                                                    iconColor="#7D7DD5"
                                                                    size={20}
                                                                    onPress={() => editData(item.attendee_id)}
                                                                />
                                                                <IconButton
                                                                    icon="delete"
                                                                    mode="contained"    
                                                                    iconColor="#DC8A8A"
                                                                    size={20}
                                                                    onPress={() => showDeleteDialog(item.attendee_id)}
                                                                />
                                                            </DataTable.Cell>
                                                        ) : (
                                                            <>
                                                                <DataTable.Cell
                                                                    numeric
                                                                    onPress={() => editData(item.attendee_id)}
                                                                >
                                                                    <Image
                                                                        source={require('../../../assets/pencil.jpg')}
                                                                        style={{
                                                                            width: 20,
                                                                            height: 20,
                                                                        }}
                                                                    />
                                                                </DataTable.Cell>
                                                                <DataTable.Cell
                                                                    numeric
                                                                    onPress={() => showDeleteDialog(item.attendee_id)}
                                                                >
                                                                    <Image
                                                                        source={require('../../../assets/delete.png')}
                                                                        style={{
                                                                            width: 20,
                                                                            height: 20,
                                                                        }}
                                                                    />
                                                                </DataTable.Cell>
                                                            </>
                                                        )}
                                                    </DataTable.Row>
                                                )
                                            })
                                        ) : (
                                            <Text style={styles.noRecords}>{config.noRecordsLabel}</Text>
                                        )
                                    }   
                                    {
                                        (attendees && (attendees.length > 0) && 
                                            (
                                                <CustomPagination page={page} numberOfPages={numberOfPages} onPageChange={setPage} from={offset} to={to} totalCells={totalCount} />  
                                            )
                                        )
                                    }                                 
                                </DataTable>
                            ) : (
                                <Text style={styles.listError}>{error}</Text>
                            ))
                        ) : (
                            <ActivityIndicator
                                size="large"
                                color="#390485"
                                style={styles.loading}
                            />
                        )}
                    </View>
                </View>                

                <DeleteDialog visible={deletePromptVisible} onConfirm={deleteData} onHide={hideDeleteDialog} />

            </ScrollView>
        </SafeAreaView>


    )
}

const styles = StyleSheet.create({
    noRecords: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
        textAlign: 'center',
        color:'#000',
        fontSize:'20px'
    },
    listError: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
        textAlign: 'center',
        color:theme.colors.error,
        fontSize:'20px'
    },
    container: {
        flex: 1,
    },
    addBtn: {
        marginTop: 20,
        width: Platform.OS == 'web' ? 250 : '40%',
        justifyContent: 'center',
        alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
        textAlign: 'center',
        paddingVertical:8
    },
    searchBtn: {
        color: '#fff',
        width: Platform.OS == 'web' ? 250 : '40%',
        justifyContent: 'center',
        alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#000'
    },
    maintable: {
        flex: 1,
        width: Platform.OS == 'web' ? '90%' : '90%',
        alignSelf: 'center',
        marginTop: 20,
    },
    flatListView: {
        width: '100%',
        marginTop: 20,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
        padding: 5,
        backgroundColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        color: 'blue',
        width: 20,
        height: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    flatListText: {
        flex: 1,
    },
    flatListButton: {
        flex: 1,
    },
    headerTitles: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
    cellItems: {
        color: '#000',
        fontSize: 14,
        fontWeight: '400'
    },
})