import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AppColors from '../utils/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Expanse from '../components/Expanse';
import ExpanseHistory from '../components/ExpanseHistory';
import {useDispatch, useSelector} from 'react-redux';
import {
  setDayDateMonth,
  setIsTracking,
  setTodaysClockInTime,
} from '../state/fetchLocation';
import {RootState, AppDispatch} from '../state/store';

type HomePageProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;

const {width, height} = Dimensions.get('window');

const HomePage: React.FC<HomePageProps> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isTracking = useSelector(
    (state: RootState) => state.mapData.isTracking,
  );
  const todaysClockInTime = useSelector(
    (state: RootState) => state.mapData.clockInTime,
  );
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    const setup = async () => {
      const today = new Date();
      await checkTrackingStatus(today);
      await getAsyncData();
      setDateInfo(today);
      await requestLocationPermission();
    };

    setup();

    navigation.setOptions({
      title: 'Welcome to ' + route.params.siteName,
    });
  }, []);

  const setDateInfo = (today: Date) => {
    const dayOfWeek = today.toLocaleDateString('en-US', {weekday: 'long'});
    const dateOfMonth = today.getDate();
    const monthOfYear = today
      .toLocaleDateString('en-US', {month: 'short'})
      .replace('.', '');

    setDay(dayOfWeek);
    setDate(dateOfMonth.toString());
    setMonth(monthOfYear);

    dispatch(
      setDayDateMonth({
        day: dayOfWeek,
        date: dateOfMonth.toString(),
        month: monthOfYear,
      }),
    );
  };

  const checkTrackingStatus = async (today: Date) => {
    const trackingStatus = await AsyncStorage.getItem('isTracking');
    const lastTrackingDate = await AsyncStorage.getItem('lastTrackingDate');
    const currentDate = today.toDateString();

    if (trackingStatus === 'true' && lastTrackingDate === currentDate) {
      console.log('Tracking status:', trackingStatus);
      dispatch(setIsTracking(true));
    } else {
      console.log('Tracking status:', trackingStatus);
      dispatch(setIsTracking(false));
      await AsyncStorage.setItem('isTracking', 'false');
    }
  };

  const getAsyncData = async () => {
    const existingLocations = await AsyncStorage.getItem('locations');
    // console.log('Existing locations:', existingLocations);
    if (existingLocations) {
      const locations = JSON.parse(existingLocations);
      const timeStamps = locations[0].timestamp;
      const time = new Date(timeStamps).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      dispatch(setTodaysClockInTime(time));
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const auth = await Geolocation.requestAuthorization('always');
        if (auth === 'granted') {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location ' +
              'so we can track your position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={styles.rootContainer}>
          <View style={styles.shiftContainer}>
            <Text style={styles.shiftText}>SHIFT TODAY</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Attendance');
              }}
              style={styles.dateContainer}>
              <Text style={styles.dateMonth}>{date}</Text>
              <Text style={styles.dateMonth}>{month}</Text>
              <Text style={styles.day}>{day}</Text>
              <MaterialIcons
                name="navigate-next"
                size={22}
                color={AppColors.primary}
                style={styles.icon}
              />
            </TouchableOpacity>
            {!isTracking && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('MapScreen', {
                    type: 'Clock in',
                  });
                }}>
                <Text style={styles.buttonTxt}>Clock In</Text>
              </TouchableOpacity>
            )}
            {isTracking && (
              <View style={styles.clockOutBtnContainer}>
                <TouchableOpacity
                  style={styles.clockOutButton}
                  // onPress={() => dispatch(handleStopTracking())}>
                  onPress={() => {
                    navigation.navigate('MapScreen', {
                      type: 'Clock out',
                    });
                  }}>
                  <Text style={styles.buttonTxt}>Clock Out</Text>
                </TouchableOpacity>
                <View style={styles.clockInTimeContainer}>
                  <Text style={styles.clockInTimeText}>
                    {todaysClockInTime}
                  </Text>
                </View>
              </View>
            )}
            <Text style={styles.shiftText}>
              Continuous punch-in is active till 12:00 AM
            </Text>
          </View>
          <Text style={styles.title}>Add Expense</Text>
          <Expanse />
          <Text style={styles.title}>Expenses History</Text>
          <View style={styles.historyView}>
            <ExpanseHistory />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  rootContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    alignSelf: 'center',
    width: width * 0.95,
    fontSize: 18,
    fontWeight: '600',
    marginTop: height * 0.025,
    marginBottom: height * 0.015,
  },
  day: {
    color: 'gray',
    fontWeight: '500',
    marginLeft: 1,
  },
  icon: {marginLeft: 'auto'},
  dateMonth: {
    color: AppColors.primary,
    marginHorizontal: 1,
    fontWeight: '500',
  },
  shiftContainer: {
    width: width * 0.95,
    borderRadius: 5,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#fff',
  },
  historyView: {
    marginBottom: height * 0.05,
  },
  shiftText: {
    color: 'gray',
    fontSize: 12,
    alignSelf: 'flex-start',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 3,
    borderRadius: 5,
  },
  clockInTimeText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 3,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    width: width * 0.9,
    height: 40,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
  clockInTimeContainer: {
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: width * 0.45,
    borderColor: AppColors.primary,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5,
  },
  clockOutButton: {
    width: width * 0.45,
    height: 40,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginTop: 5,
  },
  clockOutBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
