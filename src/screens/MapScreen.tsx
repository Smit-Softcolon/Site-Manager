import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type MapProps = NativeStackScreenProps<RootStackParamList, 'MapScreen'>;

const MapScreen = ({navigation}: MapProps) => {
  return (
    <View>
      <Text>MapScreen</Text>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
