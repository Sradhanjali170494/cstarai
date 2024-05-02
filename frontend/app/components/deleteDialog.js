import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';

const DeleteDialog = ({ visible, onConfirm, onHide }) => {
  return (
    <View>
      <Portal>
        <Dialog style={styles.container} visible={visible} onDismiss = {onHide}>
          <Dialog.Content>
            <Paragraph style={{ color: '#000', fontWeight: '500', fontSize:16 }}>
              Are you sure you want to Delete?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => onConfirm()}><Text style={{ color: 'green', fontWeight: '600' }}>Yes</Text></Button>
            <Button onPress={() => onHide()} ><Text style={{ color: 'red', fontWeight: '600' }}>No</Text></Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    width: Platform.OS == 'web' ? '25%' : '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor:'#fff',
    color:'#fff'
  }

});

export default DeleteDialog;
