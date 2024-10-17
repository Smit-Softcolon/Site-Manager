import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AppColors from '../utils/AppColors';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PunchLocation from '../components/PunchLocation';

type attandanceProps = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

const {width, height} = Dimensions.get('window');

const Attendance = ({navigation}: attandanceProps) => {
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  useEffect(() => {
    const today = new Date();
    setDateInfo(today);
  }, []);
  const clockInTime = useSelector(
    (state: RootState) => state.mapData.clockInTime,
  );
  const isTracking = useSelector(
    (state: RootState) => state.mapData.isTracking,
  );

  const setDateInfo = (today: Date) => {
    const dayOfWeek = today.toLocaleDateString('en-US', {weekday: 'long'});
    const dateOfMonth = today.getDate();
    const monthOfYear = today
      .toLocaleDateString('en-US', {month: 'short'})
      .replace('.', '');

    setDay(dayOfWeek);
    setDate(dateOfMonth.toString());
    setMonth(monthOfYear);
  };
  return (
    <View style={styles.rootContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateMonth}>{date}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>
      <View style={styles.inOutContainer}>
        <View style={styles.inContainer}>
          <Text style={styles.inOutTitle}>CLOCK IN</Text>
          <Text style={styles.inTime}>{clockInTime}</Text>
        </View>
        <View style={styles.outContainer}>
          <Text style={styles.inOutTitle}>CLOCK OUT</Text>
          <Text style={styles.outTime}>MISSING</Text>
        </View>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.btnContainer}>
        {isTracking && (
          <TouchableOpacity style={styles.punchBtn}>
            <Text>Punch </Text>
            <MaterialIcons name="location-pin" size={18} color="green" />
          </TouchableOpacity>
        )}
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
              <Text style={styles.clockInTimeText}>{clockInTime}</Text>
            </View>
          </View>
        )}
      </View>
      <PunchLocation />
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockOutButton: {
    width: width * 0.33,
    height: 37,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginLeft: 10,
  },
  day: {
    color: 'gray',
    fontWeight: '500',
    marginLeft: 1,
  },
  dateMonth: {
    color: AppColors.primary,
    marginHorizontal: 1,
    fontWeight: '500',
  },
  clockInTimeContainer: {
    backgroundColor: '#fff',
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: width * 0.33,
    borderColor: AppColors.primary,
    borderWidth: 1,
    alignSelf: 'center',
  },
  inOutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 2,
  },
  inOutTitle: {
    color: 'gray',
    fontWeight: '600',
    fontSize: 13,
  },
  inTime: {
    fontSize: 13,
    color: 'green',
  },
  clockInTimeText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    // paddingTop: 7,
    // paddingBottom: 3,
    borderRadius: 5,
    marginLeft: 5,
  },
  outTime: {
    fontSize: 13,
    color: 'red',
  },
  inContainer: {
    alignItems: 'flex-start',
  },
  outContainer: {
    alignItems: 'flex-end',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginVertical: 3,
    marginHorizontal: 2,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    width: width * 0.94,
    marginTop: 10,
    height: 37,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  punchBtn: {
    height: 37,
    width: width * 0.25,
    paddingHorizontal: width * 0.04,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  clockOutBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
