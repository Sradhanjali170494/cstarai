import React, { memo } from 'react';
import {View, Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/images/logo-h.png')} style={styles.image} />
 
);

const styles = StyleSheet.create({
  image: {
    width:400,
    height:70,
    marginBottom: 20,
    marginTop:10,    
    alignItems: 'center',
    resizeMode:"contain"
    
  },
});

export default memo(Logo);
