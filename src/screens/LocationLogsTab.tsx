import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppColors from '../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../state/store';
import {
  fetchAndAddLocation,
  getLocationsFromAsyncStorage,
} from '../state/fetchLocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import LocationLogs from '../components/LocationLogs';

const {height, width} = Dimensions.get('window');

type LocationLogsProps = NativeStackScreenProps<
  RootStackParamList,
  'LocationLogs'
>;

const LocationLogsTab = ({navigation}: LocationLogsProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const today = new Date();
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [clockOutTime, setClockOutTime] = useState('MISSING');
  const dispatch = useDispatch<AppDispatch>();
  const locList = useSelector(
    (state: RootState) => state.mapData.locationDataList,
  );
  const inOutList = locList.filter(
    item => item.source === 'In' || item.source === 'Out',
  );

  const punchList = locList.filter(item => item.source === 'Punch');

  useEffect(() => {
    const today = new Date();
    setDateInfo(today);
    dispatch(getLocationsFromAsyncStorage());
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
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    if (newDate <= today) {
      setCurrentDate(newDate);
    }
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Check if selected date is not in future
      if (selectedDate <= today) {
        setCurrentDate(selectedDate);
      }
    }
  };

  const clockInTime = useSelector(
    (state: RootState) => state.mapData.clockInTime,
  );
  const firstClockInTimeFormated = inOutList[0]?.timestamp
    ? new Date(inOutList[0]?.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'MISSING';
  const isTracking = useSelector(
    (state: RootState) => state.mapData.isTracking,
  );

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={handlePreviousDay} style={styles.arrow}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={AppColors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextDay}
          style={styles.arrow}
          disabled={isToday(currentDate)}>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={isToday(currentDate) ? '#c4c4c4' : AppColors.primary}
          />
        </TouchableOpacity>
      </View>
      {locList.length > 0 ? (
        <>
          <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.rootContainer}>
              <View style={styles.inOutContainer}>
                <View style={styles.inContainer}>
                  <Text style={styles.inOutTitle}>CLOCK IN</Text>
                  <Text style={styles.inTime}>{firstClockInTimeFormated}</Text>
                </View>
                <View style={styles.outContainer}>
                  <Text style={styles.inOutTitle}>CLOCK OUT</Text>
                  <Text style={styles.outTime}>{clockOutTime}</Text>
                </View>
              </View>
              <View style={styles.divider}></View>
              <Text style={styles.timeLogTxt}>TIME LOGS</Text>
              <Text style={styles.listTitle}>Remote Clock In</Text>
              <LocationLogs dataList={inOutList} />
              <Text style={styles.listTitle}>Location Punch</Text>
              <LocationLogs dataList={punchList} />
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => {
              navigation.navigate('ActivityMap', []);
            }}>
            <Text style={styles.buttonTxt}>View Activity</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noDataTxt}>
          <Text>No Data</Text>
        </View>
      )}
      {showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={today}
          style={styles.datePicker}
        />
      )}
    </View>
  );
};

export default LocationLogsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noDataTxt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
  },
  arrow: {
    padding: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 10,
    color: AppColors.primary,
  },
  datePicker: {
    backgroundColor: 'white',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 60,
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
  bottomButton: {
    position: 'absolute',
    bottom: 10,
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
  timeLogTxt: {
    color: 'black',
    fontSize: 12,
    marginTop: 10,
  },
  listTitle: {
    color: 'gray',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
});
