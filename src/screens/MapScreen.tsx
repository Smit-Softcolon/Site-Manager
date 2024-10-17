import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../state/store';
import {
  configureBackgroundFetch,
  fetchAndAddLocation,
  fetchLocation,
  handleStartTracking,
  handleStopTracking,
  setIsTracking,
  setTodaysClockInTime,
  setupLocationFetching,
} from '../state/fetchLocation';
import {getDistance} from 'geolib';
import MapView, {Circle, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import ALL_APIS from '../network/apis';
import formatDate from '../utils/FormateDate';
import {date} from 'yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type MapProps = NativeStackScreenProps<RootStackParamList, 'MapScreen'>;

const {width, height} = Dimensions.get('window');

const MapScreen: React.FC<MapProps> = ({navigation, route}) => {
  Geocoder.init(ALL_APIS.MAP_KEY, {language: 'en'});
  const dispatch = useDispatch<AppDispatch>();
  const isTracking = useSelector(
    (state: RootState) => state.mapData.isTracking,
  );
  const todaysClockInTime = useSelector(
    (state: RootState) => state.mapData.clockInTime,
  );
  const [type, setType] = useState(route.params.type);

  const predefinedLocation = {
    latitude: 23.0318078,
    longitude: 72.6732641,
    radius: 100,
  };
  const [time, setTime] = useState('');
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const fetchLat = useSelector((state: RootState) => state.mapData.latitude);
  const fetchLong = useSelector((state: RootState) => state.mapData.longitude);
  const [circleColor, setCircleColor] = useState('red');
  const [currentAddress, setCurrentAddress] = useState('');
  const [date, setDate] = useState('');
  const [isInRange, setIsInRange] = useState(false);
  const [distanceMsg, setDistanceMsg] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: predefinedLocation.latitude,
    longitude: predefinedLocation.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const getAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await Geocoder.from(lat, lon);
      if (response.results.length > 0) {
        const address = response.results[0].formatted_address;
        return address;
      } else {
        throw new Error('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Address not found';
    }
  };

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const date = now.toDateString();
      const dateFormatted = formatDate(date);
      setDate(dateFormatted);

      setTime(`${hours} : ${minutes} : ${seconds} ${ampm}`);
    };

    // Update time initially
    updateTime();

    // Create an interval to update the time every second
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup the interval on component unmount
    const setup = async () => {
      await dispatch(fetchLocation());
    };

    setup();

    checkIfWithinRange(latitude, longitude);
    var title = route.params.type;
    setType(title);

    navigation.setOptions({
      title: 'Confirm ' + title,
    });
    return () => clearInterval(intervalId);
  }, []);

  // move to current location
  const moveToCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        (position: any) => {
          const {latitude, longitude} = position.coords;

          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          setMapRegion(newRegion);
          setLatitude(latitude);
          setLongitude(longitude);
          checkIfWithinRange(latitude, longitude);
          getAddressFromCoordinates(latitude, longitude).then(address =>
            setCurrentAddress(address),
          );
        },
        error => {
          console.error('Error getting current location:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  useEffect(() => {
    if (fetchLat !== 0 && fetchLong !== 0) {
      setLatitude(fetchLat);
      setLongitude(fetchLong);
      checkIfWithinRange(fetchLat, fetchLong);
      getAddressFromCoordinates(fetchLat, fetchLong).then(function (address) {
        // console.log('Address:', address);

        return setCurrentAddress(address);
      });
    }
  }, [fetchLat, fetchLong]);

  const checkIfWithinRange = (lat: number, lon: number) => {
    const distance = getDistance(
      {latitude: lat, longitude: lon},
      {
        latitude: predefinedLocation.latitude,
        longitude: predefinedLocation.longitude,
      },
    );

    if (distance <= predefinedLocation.radius) {
      setCircleColor('green');
      setIsInRange(true);
    } else {
      // console.log('Distance:', distance);

      setDistanceMsg(
        distance.toFixed().toString() + ' meters away from the work location',
      );
      setCircleColor('red');
      setIsInRange(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        scrollEnabled={false}
        zoomEnabled={false}
        region={mapRegion}>
        <Circle
          center={{
            latitude: predefinedLocation.latitude,
            longitude: predefinedLocation.longitude,
          }}
          radius={predefinedLocation.radius}
          strokeWidth={2}
          strokeColor={circleColor}
          fillColor="rgba(135,206,250,0.3)"
        />
        {latitude !== 0 && longitude !== 0 && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title={currentAddress}
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.bottomContainer}>
        <Text style={styles.locTitle}>LOCATION</Text>
        <Text style={styles.address}>{currentAddress}</Text>
        <View style={styles.timeContainer}>
          <View>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <TouchableOpacity
            onPress={moveToCurrentLocation}
            style={styles.currentLocContainer}>
            <MaterialIcons name="location-on" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (type === 'Clock in' && !isInRange) {
                await dispatch(handleStartTracking());
                await dispatch(configureBackgroundFetch());
                await dispatch(setupLocationFetching());
                navigation.goBack();
              } else if (type === 'Clock out') {
                await dispatch(handleStopTracking(false));
                navigation.goBack();
              }
            }}
            style={styles.button}>
            <Text style={styles.btnColor}>{type}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceTxt}>{distanceMsg}</Text>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: height,
  },
  locTitle: {
    fontSize: 12,
    color: 'gray',
    marginHorizontal: 10,
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 7,
  },
  time: {
    fontSize: 20,
    color: 'black',
  },
  date: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  btnColor: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentLocContainer: {
    position: 'absolute',
    bottom: height * 0.08,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  distanceTxt: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center',
    color: 'red',
    fontSize: 12,
    fontWeight: '500',
  },
  distanceContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    position: 'absolute',
    marginTop: 10,
    top: 0,
    borderRadius: 5,
    alignSelf: 'center',
  },
});
