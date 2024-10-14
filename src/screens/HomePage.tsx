import React from 'react';
import {
  Button,
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
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Expanse from '../components/Expanse';
import ExpanseHistory from '../components/ExpanseHistory';

type HomePageProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;

const {width, height} = Dimensions.get('window');

const FETCH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const LAST_FETCH_KEY = 'LAST_FETCH_TIME';

interface HomePageState {
  day: string;
  date: string;
  month: string;
  isTracking: boolean;
  clockInTime: string;
}

class HomePage extends React.Component<HomePageProps, HomePageState> {
  timeoutId: NodeJS.Timeout | null;
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      day: '',
      date: '',
      month: '',
      isTracking: false,
      clockInTime: '',
    };
    this.timeoutId = null;
  }

  async componentDidMount() {
    const today = new Date();

    await this.checkTrackingStatus(today);
    await this.getAsyncData();

    const dayOfWeek = today.toLocaleDateString('en-US', {weekday: 'long'});
    const dateOfMonth = today.getDate();
    const monthOfYear = today
      .toLocaleDateString('en-US', {month: 'short'})
      .replace('.', '');

    this.setState({
      day: dayOfWeek,
      date: dateOfMonth.toString(),
      month: monthOfYear,
    });

    await this.requestLocationPermission();
    await this.configureBackgroundFetch();
    this.setupLocationFetching();

    this.props.navigation.setOptions({
      title: 'Welcome to ' + this.props.route.params.siteName,
    });
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  checkTrackingStatus = async (today: Date) => {
    const trackingStatus = await AsyncStorage.getItem('isTracking');
    const lastTrackingDate = await AsyncStorage.getItem('lastTrackingDate');
    const currentDate = today.toDateString();

    if (trackingStatus === 'true' && lastTrackingDate === currentDate) {
      this.setState({isTracking: true});
      BackgroundFetch.start();
    } else {
      this.setState({isTracking: false});
      BackgroundFetch.stop();
      await AsyncStorage.setItem('isTracking', 'false');
    }
  };

  getAsyncData = async () => {
    const existingLocations = await AsyncStorage.getItem('locations');
    console.log('Existing locations:', existingLocations);
    if (existingLocations) {
      const locations = JSON.parse(existingLocations);
      const timeStamps = locations[0].timestamp;
      const time = new Date(timeStamps).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      this.setState({clockInTime: time});
    }
  };

  requestLocationPermission = async () => {
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

  configureBackgroundFetch = async () => {
    console.log('[BackgroundFetch] Configuring...');

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        forceAlarmManager: false,
      },
      async taskId => {
        console.log('[BackgroundFetch] Task: ', taskId);
        if (this.state.isTracking) {
          await this.fetchAndAddLocation('background');
          console.log('configureBackgroundFetch');          
        }
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[BackgroundFetch] Failed to configure:', error);
      },
    );
  };

  setupLocationFetching = async () => {
    const lastFetchTime = await this.getLastFetchTime();
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;

    if (timeSinceLastFetch >= FETCH_INTERVAL) {
      // If it's been more than 15 minutes since the last fetch, fetch immediately
      if (this.state.isTracking) {
        await this.fetchAndAddLocation('foreground');
        console.log('setupLocationFetching');        
      }
    } else {
      // Otherwise, set a timeout for the remaining time
      const remainingTime = FETCH_INTERVAL - timeSinceLastFetch;
      if (this.state.isTracking) this.scheduleNextFetch(remainingTime);
    }
  };

  scheduleNextFetch = (delay: number) => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.fetchAndAddLocation('foreground').then(() => {
        console.log('scheduleNextFetch');        
      });
      this.scheduleNextFetch(FETCH_INTERVAL);
    }, delay);
  };

  getLastFetchTime = async () => {
    try {
      const lastFetchTime = await AsyncStorage.getItem(LAST_FETCH_KEY);
      return lastFetchTime ? parseInt(lastFetchTime) : 0;
    } catch (error) {
      console.error('Error reading last fetch time:', error);
      return 0;
    }
  };

  setLastFetchTime = async (time: number) => {
    try {
      await AsyncStorage.setItem(LAST_FETCH_KEY, time.toString());
    } catch (error) {
      console.error('Error saving last fetch time:', error);
    }
  };

  fetchAndAddLocation = async (source: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const midnightTime = 24 * 60;

    if (currentTime >= midnightTime - 1 && currentTime < midnightTime) {
      await this.handleStopTracking();
      return;
    }

    Geolocation.getCurrentPosition(
      async (position: {coords: {latitude: any; longitude: any}}) => {
        const {latitude, longitude} = position.coords;
        const timestamp = new Date().toISOString();
        const locationData = {latitude, longitude, timestamp, source};

        try {
          // Get existing locations
          const existingLocations = await AsyncStorage.getItem('locations');
          const locations = existingLocations
            ? JSON.parse(existingLocations)
            : [];

          // Add new location
          locations.push(locationData);

          // Store updated locations
          await AsyncStorage.setItem('locations', JSON.stringify(locations));
          await this.setLastFetchTime(Date.now());
          console.log('Location stored:', locationData);
        } catch (error) {
          console.error('Failed to store location:', error);
        }
      },
      (error: any) => {
        console.log('Error getting location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  handleStartTracking = async () => {
    const today = new Date();
    // await this.fetchAndAddLocation('foreground');
    // console.log('handleStartTracking');
    
    BackgroundFetch.start();
    this.setState({isTracking: true});
    await AsyncStorage.setItem('isTracking', 'true');
    await AsyncStorage.setItem('lastTrackingDate', today.toDateString());
    const clockInTime = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.setState({clockInTime});
    this.setupLocationFetching();
    this.props.navigation.navigate('MapScreen');
  };

  handleStopTracking = async () => {
    try {
      BackgroundFetch.stop();
      this.setState({isTracking: false});
      await AsyncStorage.setItem('isTracking', 'false');
      await AsyncStorage.removeItem('lastTrackingDate');
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    } catch (error) {
      console.error('Failed to stop tracking:', error);
    }
  };

  render() {
    const {day, date, month, isTracking, clockInTime} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView>
          <View style={styles.rootContainer}>
            <View style={styles.shiftContainer}>
              <Text style={styles.shiftText}>SHIFT TODAY</Text>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('Attendance');
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
                  onPress={this.handleStartTracking}>
                  <Text style={styles.buttonTxt}>Clock In</Text>
                </TouchableOpacity>
              )}
              {isTracking && (
                <View style={styles.clockOutBtnContainer}>
                  <TouchableOpacity
                    style={styles.clockOutButton}
                    onPress={this.handleStopTracking}>
                    <Text style={styles.buttonTxt}>Clock Out</Text>
                  </TouchableOpacity>
                  <View style={styles.clockInTimeContainer}>
                    <Text style={styles.clockInTimeText}>{clockInTime}</Text>
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
  }
}

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
