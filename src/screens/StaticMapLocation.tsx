import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import getAddresses from '../utils/GetAddress';
import formatDate, {dateFormator} from '../utils/FormateDate';
import {date} from 'yup';

const {height, width} = Dimensions.get('window');

type StaticMapLocationProps = NativeStackScreenProps<
  RootStackParamList,
  'StaticMapLocation'
>;

const StaticMapLocation = ({route, navigation}: StaticMapLocationProps) => {
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddresses(
        route.params.latitude,
        route.params.longitude,
      );
      setAddress(address!);
    };
    const formatedTime = dateFormator(route.params.timestamp);
    const formatedDate = formatDate(route.params.timestamp);
    setDate(formatedDate);
    setTime(formatedTime);
    fetchAddress();
    return setMapRegion({
      latitude: route.params.latitude,
      longitude: route.params.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }, []);
  return (
    <View>
      <MapView
        style={styles.map}
        scrollEnabled={false}
        zoomEnabled={false}
        region={mapRegion}>
        {route.params.latitude !== 0 && route.params.longitude !== 0 && (
          <Marker
            coordinate={{
              latitude: route.params.latitude,
              longitude: route.params.longitude,
            }}
            title="Location"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.bottomContainer}>
        <View style={styles.upperContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.upperTitle}>
              {route.params.source !== 'Punch'
                ? 'Remote Clock ' + route.params.source
                : 'Punch'}
            </Text>
            <Text style={styles.dateTxt}>{date}</Text>
          </View>
          <Text style={styles.timeTxt}>{time}</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.belowContainer}>
          <Text style={styles.locTitle}>LOCATION</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
      </View>
    </View>
  );
};

export default StaticMapLocation;

const styles = StyleSheet.create({
  upperContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  timeTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 15,
  },
  leftContainer: {
    width: '50%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dateTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
  },
  belowContainer: {
    paddingBottom: height * 0.06,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginVertical: 3,
    marginHorizontal: 2,
  },
  map: {
    width: '100%',
    height: height,
  },
  locTitle: {
    fontSize: 13,
    color: 'gray',
    marginHorizontal: 10,
    marginTop: 5,
  },
  upperTitle: {
    fontSize: 13,
    color: 'gray',
    marginTop: 5,
  },
  address: {
    fontSize: 14,
    color: 'black',
    marginHorizontal: 10,
    marginTop: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingBottom: 30,
    paddingTop: 5,
  },
});
