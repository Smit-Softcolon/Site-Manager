import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppColors from '../utils/AppColors';

const {height, width} = Dimensions.get('window');

interface TabProps {
  color: any;
  iconName: string;
  title: string;
  desc: string;
}

const Tab = ({color, iconName, title, desc}: TabProps) => {
  return (
    <View style={styles.rootContainer}>
      <MaterialIcons name={iconName} color={color} size={30} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({
  rootContainer: {
    width: width * 0.46,
    height: height * 0.15,
    borderRadius: 5,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: AppColors.lightGray,
    padding: 10,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  desc: {
    color: AppColors.primary,
    opacity: 0.4,
    fontSize: 14,
    marginTop: 2,
  },
});
