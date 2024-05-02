import React, { useState, useCallback } from 'react';
import { capitalizeWords, dateFormat } from '../../utils';
import CustomPagination from '../../components/CustomPagination';
import DeleteDialog from '../../components/deleteDialog';
import { itemsPerPage } from '../../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { useRouter } from 'expo-router';

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
} from 'react-native-paper'

export default function Page() {  
  const isAuth = useSelector(state => state.auth.isLoggedIn);
  const router = useRouter();
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [registrationId, setRegistrationId] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [deletePromptVisible, setDeletePromptVisible] = useState(false)

  const numberOfPages = Math.ceil(registrations.length / itemsPerPage);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, registrations.length);

  const registrationsList = [
    {
        "id": 1,
        "conference": "Diabetes Conference",
        "attendee": "Jack",
        "date": "05-20-2024",
        "status": "active"
    },
    {
        "id": 2,
        "conference": "Obesity Conference",
        "attendee": "John",
        "date": "05-20-2024",
        "status": "idle"
    }
  ]

  const showDeleteDialog = (id) => {
    setDeletePromptVisible(true)
    setRegistrationId(id);
  }

  const hideDeleteDialog = () => {
    setDeletePromptVisible(false)
    setRegistrationId(0);
  }

  const deleteData = () => {
    console.log(registrationId);
    setDeletePromptVisible(false)
    setRegistrationId(0);
  }

  useFocusEffect(
      useCallback(() => {
        authRedirect();
        fetchData();
      }, [])
  );

  const authRedirect = () => {
      if(!isAuth){
          setTimeout(() => {
              router.push("logout")
          }, 100);
      } 
  }

  const fetchData = () => {
    setRegistrations(registrationsList)
    setLoading(false)
  }

  const searchData = (text) => {
    setSearch(text)
  }

  const status = (val) => {
    const statusColor = (val == "active") ? "green" : "red";
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
            <Searchbar
              style={styles.searchBtn}
              placeholder="Search"
              value={search}
              onChangeText={(text) => searchData(text)}
            />
          </View>
          <View style={styles.maintable}>
            {!loading ? (
              <DataTable style={{ backgroundColor: '#fff' }}>
                <DataTable.Header>
                  <DataTable.Title textStyle={styles.headerTitles}>Conference</DataTable.Title>
                  <DataTable.Title textStyle={styles.headerTitles}>Attendee</DataTable.Title>
                  <DataTable.Title textStyle={styles.headerTitles}>Date</DataTable.Title>
                  <DataTable.Title textStyle={styles.headerTitles}>Status</DataTable.Title>
                  <DataTable.Title textStyle={styles.headerTitles}>Manage</DataTable.Title>
                </DataTable.Header>
                {registrations &&
                  registrations.length > 0 &&
                  registrations.slice(from, to).map((item) => {
                    return (
                      <DataTable.Row key={item.id}>
                        <DataTable.Cell textStyle={styles.cellItems}>{capitalizeWords(item.conference)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cellItems}>{capitalizeWords(item.attendee)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cellItems}>{dateFormat(item.date)}</DataTable.Cell>
                        <DataTable.Cell textStyle={styles.cellItems}>{status(item.status)}</DataTable.Cell>
                        {Platform.OS == 'web' ? (
                          <DataTable.Cell>
                            <IconButton
                              icon="delete"
                              mode="contained"
                              iconColor="#DC8A8A"
                              size={20}
                              onPress={() => showDeleteDialog(item.id)}
                            />
                          </DataTable.Cell>
                        ) : (
                          <>
                            <DataTable.Cell
                              numeric
                              onPress={() => showDeleteDialog(item.id)}
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
                  })}
                <CustomPagination page={page} numberOfPages={numberOfPages} onPageChange={setPage} from={from} to={to} totalCells={registrations.length} />
              </DataTable>
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
  container: {
    flex: 1,
  },
  addBtn: {
    marginTop: 20,
    width: Platform.OS == 'web' ? 200 : '40%',
    justifyContent: 'center',
    alignItems: Platform.OS == 'web' ? 'center' : 'stretch',
    textAlign: 'center',
  },
  addBtnTxt: {
    color: '#fff',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16
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
  }
})