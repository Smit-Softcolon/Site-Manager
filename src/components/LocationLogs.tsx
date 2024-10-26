import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {dateFormator} from '../utils/FormateDate';
import getAddresses, {getCityAndState} from '../utils/GetAddress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppColors from '../utils/AppColors';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const {width, height} = Dimensions.get('window');

interface LocationItem {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  source: 'In' | 'Out' | 'Punch';
}

interface LocationWithAddress extends LocationItem {
  address: string;
}

interface LocationLogsProps {
  dataList: LocationItem[];
}

const LocationLogs = ({dataList}: LocationLogsProps) => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [processedData, setProcessedData] = useState<LocationWithAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const itemsWithAddresses = await Promise.all(
          dataList.map(async item => {
            const address =
              (await getCityAndState(item.latitude, item.longitude)) ||
              'Unknown address';
            return {
              ...item,
              address,
            };
          }),
        );
        setProcessedData(itemsWithAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [dataList]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading locations...</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={processedData}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({item}) => {
          const time = dateFormator(item.timestamp);
          return (
            <View style={styles.mainContainer}>
              <View style={styles.timeContainer}>
                {item.source === 'In' && (
                  <Feather name="arrow-down-left" size={20} color="green" />
                )}
                {item.source === 'Out' && (
                  <Feather name="arrow-up-right" size={20} color="red" />
                )}
                {item.source === 'Punch' && (
                  <Ionicons name="pin-outline" size={24} color="black" />
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.timeTxt}>{time}</Text>
                  <Text style={styles.addressTxt}>{item.address}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => {
                navigation.navigate('StaticMapLocation', {
                  latitude: item.latitude,
                  longitude: item.longitude,
                  timestamp: item.timestamp,
                  source: item.source,
                });
              }}>
                <MaterialIcons
                  style={{marginRight: 10}}
                  name="location-on"
                  size={24}
                  color={AppColors.primary}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {dataList.length !== 0 &&
        dataList[dataList.length - 1].source === 'In' && (
          <View
            style={[
              styles.timeContainer,
              styles.mainContainer,
              {width: width - 20, backgroundColor: '#ffcccb', borderRadius: 5},
            ]}>
            <Feather name="arrow-up-right" size={20} color="red" />
            <View style={styles.textContainer}>
              <Text style={styles.timeTxt}>OUT missing</Text>
            </View>
          </View>
        )}
    </View>
  );
};

export default LocationLogs;

const styles = StyleSheet.create({
  timeTxt: {
    fontSize: 14,
    color: 'black',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  addressTxt: {
    fontSize: 12,
    color: 'black',
    marginLeft: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    width: width * 0.75,
    alignItems: 'flex-start',
    padding: 3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
