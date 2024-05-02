import React, { memo } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../theme';

const TextInput = ({ errorText, ...props }) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode={Platform.OS=='web'?'flat':'outlined'}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '110%',
    marginVertical: 20,
    height:50
  },
  input: {
    backgroundColor: theme.colors.surface,
    height: Platform.OS == 'web' ? 50:'',
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
