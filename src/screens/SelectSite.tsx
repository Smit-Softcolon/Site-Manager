import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AppImages from '../utils/AppImages';
import AppColors from '../utils/AppColors';

const {width, height} = Dimensions.get('window');

type SelectSiteProps = NativeStackScreenProps<RootStackParamList, 'SelectSite'>;

const SelectSite = ({navigation}: SelectSiteProps) => {
  var dataList = [
    {
      id: 1,
      name: 'Ananta',
      image: AppImages.SITE1,
    },
    {
      id: 2,
      name: 'Mahadev Lavish',
      image: AppImages.SITE2,
    },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select one site</Text>
      <View style={styles.listContainer}>
        <FlatList
          scrollEnabled={false}
          data={dataList}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HomePage', {siteName: item.name});
              }}
              style={styles.mainListContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </View>
              <Text style={styles.listText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default SelectSite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: width * 0.02,
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginVertical: height * 0.015,
  },
  listContainer: {
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: height * 0.01,
    alignSelf: 'center',
  },
  mainListContainer: {
    marginTop: height * 0.015,
  },
});
