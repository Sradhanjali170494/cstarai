import React, { memo } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../theme';

const TextArea = ({ errorText, ...props }) => (
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
    width: Platform.OS == 'web' ? '350%':'100%',
    marginVertical: 20,
    height:70
  },
  input: {
    backgroundColor: theme.colors.surface,
    height: Platform.OS == 'web' ? 70:'',
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextArea);
