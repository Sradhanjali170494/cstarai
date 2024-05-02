import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const CustomPagination = ({ page, numberOfPages, onPageChange, from, to, totalCells }) => {
  return (
    <View style={styles.container}>
      <IconButton
        containerColor='#000'
        iconColor='#fff'
        size={20}
        icon="chevron-left"
        onPress={() => page > 0 && onPageChange(page - 1)}
        disabled={page === 0}
        style={{ opacity: page === 0 ? 0.5 : 1 }}
      />
      <Text style={styles.pageInfo}>
        {from + 1}-{to} of {totalCells}
      </Text>
      <IconButton
        containerColor='#000'
        icon="chevron-right"
        iconColor='#fff'
        size={20}
        onPress={() => page < numberOfPages - 1 && onPageChange(page + 1)}
        disabled={page === numberOfPages - 1}
        style={{ opacity: page === numberOfPages - 1 ? 0.5 : 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf:'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical:10,
    marginHorizontal:20
  },
  pageInfo: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#000'
  }
  
});

export default CustomPagination;
