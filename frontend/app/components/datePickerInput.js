import React, { memo } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { theme } from '../theme';
import { DatePickerInput } from 'react-native-paper-dates';

const DatePicker = ({ errorText, ...props }) => (
  <View style={styles.container}>
      <DatePickerInput
            style={styles.datepickerInput}
            locale="en"                                        
            inputMode="start"
            editable={false}
            renderInput={({ value, onPress }) => (
                <TextInput
                    mode="outlined"
                    label="Date"
                    value={value}
                    onTouchStart={onPress} 
                    showSoftInputOnFocus={false} 
                />
            )}
            {...props}
        />
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20
  },  
  datepickerInput: {
      backgroundColor:'#fff',
      color:'#000',
      height:50
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop:4
  },
});

export default memo(DatePicker);
