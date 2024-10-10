import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AppColors from '../utils/AppColors';

type HomePageProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;

const HomePage = ({navigation, route}: HomePageProps) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Welcome to ' + route.params.siteName,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: AppColors.primary,
      },
    });
  }, [route, navigation]);
  return (
    <View style={styles.rootContainer}>
      <Text>HomePage</Text>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
