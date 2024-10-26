import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AppColors from '../utils/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Expanse from '../components/Expanse';
import ExpanseHistory from '../components/ExpanseHistory';
import {useDispatch, useSelector} from 'react-redux';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {
  setDayDateMonth,
  setIsTracking,
  setTodaysClockInTime,
} from '../state/fetchLocation';
import {RootState, AppDispatch} from '../state/store';
import BackgroundService from 'react-native-background-actions';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Tab from '../components/Tab';

const {width, height} = Dimensions.get('window');

type HomePageProps = NativeStackScreenProps<RootStackParamList, 'HomePage'>;

const HomePage = ({route, navigation}: HomePageProps) => {
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

    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Messages');
            }}>
            <MaterialIcons name="notifications-active" size={24} />
          </TouchableOpacity>
        );
      },
    });

    setup();

    const isRunning = BackgroundService.isRunning();
    console.log('Background service is running', isRunning);

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
          Linking.openURL('app-settings:');
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
          await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  ///option 2
  //   const openAppSettings = async () => {
  //   if (Platform.OS === 'ios') {
  //     await Linking.openSettings();
  //   } else {
  //     try {
  //       // Using Android's native ACTION_APPLICATION_DETAILS_SETTINGS
  //       const androidPackage = NativeModules.BuildConfig?.APPLICATION_ID ||
  //                            'com.sitemanager'; // replace with your app's package name
  //       const uri = `package:${androidPackage}`;
  //       await Linking.openSettings();
  //     } catch (error) {
  //       console.error('Failed to open settings:', error);
  //       // Fallback to opening general settings
  //       try {
  //         await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
  //       } catch (fallbackError) {
  //         console.error('Failed to open location settings:', fallbackError);
  //       }
  //     }
  //   }
  // };

  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     try {
  //       const auth = await Geolocation.requestAuthorization('always');
  //       if (auth === 'granted') {
  //         console.log('Location permission granted');
  //       } else {
  //         await openAppSettings();
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //       await openAppSettings();
  //     }
  //   } else if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location Permission Required',
  //           message:
  //             'This app needs access to your location all the time. ' +
  //             'Please enable "Allow all the time" in the next screen.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       // Regardless of the permission result, open settings
  //       // This allows users to enable "Allow all the time"
  //       await openAppSettings();

  //     } catch (err) {
  //       console.warn(err);
  //       await openAppSettings();
  //     }
  //   }
  // };

  /// option 3

  // const openAppLocationSettings = async () => {
  //   if (Platform.OS === 'ios') {
  //     await Linking.openSettings();
  //   } else {
  //     try {
  //       // First try to open the app's location permission settings directly
  //       const packageName = NativeModules.BuildConfig?.APPLICATION_ID || 'com.sitemanager';
  //       await Linking.openSettings();

  //       // If you specifically want to open directly to location settings, you can use this instead:
  //       // await Linking.sendIntent('android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION', {
  //       //   data: 'package:' + NativeModules.BuildConfig?.APPLICATION_ID || 'com.sitemanager'
  //       // });

  //       // Another alternative specifically for location:
  //       // await Linking.sendIntent('android.settings.MANAGE_APPLICATIONS_SETTINGS');

  //     } catch (error) {
  //       console.error('Failed to open app settings:', error);
  //       try {
  //         // Fallback to general location settings
  //         await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
  //       } catch (fallbackError) {
  //         console.error('Failed to open location settings:', fallbackError);
  //         // Last resort: try to open general app settings
  //         await Linking.openSettings();
  //       }
  //     }
  //   }
  // };

  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     try {
  //       const auth = await Geolocation.requestAuthorization('always');
  //       if (auth === 'granted') {
  //         console.log('Location permission granted');
  //       } else {
  //         await openAppLocationSettings();
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //       await openAppLocationSettings();
  //     }
  //   } else if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location Permission Required',
  //           message:
  //             'This app needs access to your location all the time. ' +
  //             'Please enable "Allow all the time" in the next screen.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         // If permission not granted, show alert and then open settings
  //         Alert.alert(
  //           'Location Permission',
  //           'Please enable location permission with "Allow all the time" option for proper functionality.',
  //           [
  //             {
  //               text: 'Open Settings',
  //               onPress: openAppLocationSettings
  //             },
  //             {
  //               text: 'Cancel',
  //               style: 'cancel'
  //             }
  //           ]
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //       await openAppLocationSettings();
  //     }
  //   }
  // };

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
          {/* <Text style={styles.title}>Add Expense</Text>
          <Expanse />
          <Text style={styles.title}>Expenses History</Text>
          <View style={styles.historyView}>
            <ExpanseHistory />
          </View> */}
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('ExpanseScreen');
              }}>
              <Tab
                iconName="currency-rupee"
                color={AppColors.mediumRed}
                title="Expanses"
                desc="Add expanses and view history"
              />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('SiteDetails');
              }}>
              <Tab
                iconName="location-city"
                color={AppColors.purple}
                title="Site details"
                desc="View and share site details"
              />
            </Pressable>
          </View>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('AddLeads');
              }}>
              <Tab
                iconName="leaderboard"
                color={AppColors.green}
                title="Add leads"
                desc="Add customer leads here"
              />
            </Pressable>
            <Pressable
              onPress={() => {
                // navigation.navigate('LocationLogs');
              }}>
              <Tab
                iconName="construction"
                color={AppColors.brown}
                title="Site Progress"
                desc="View site progress here"
              />
            </Pressable>
          </View>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('ApplyLeave');
              }}>
              <Tab
                iconName="exit-to-app"
                color={AppColors.orange}
                title="Apply leave"
                desc="Apply for your next leave here"
              />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('LocationLogs');
              }}>
              <Tab
                iconName="location-on"
                color={AppColors.mediumRed}
                title="Location logs"
                desc="View all attendance logs here"
              />
            </Pressable>
          </View>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <Tab
                iconName="person"
                color={AppColors.blue}
                title="Profile"
                desc="Edit your profile"
              />
            </Pressable>
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
  tabContainer: {
    width: width * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
