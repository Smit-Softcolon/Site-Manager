import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppColors from '../utils/AppColors';
import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const {width, height} = Dimensions.get('window');

type AttendanceProps = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

const Attendance = () => {
  return (
    <ScrollView>
      <View style={styles.rootContainer}>
        <View style={styles.shiftContainer}>
          <Text style={styles.shiftText}>SHIFT TODAY</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateMonth}>{date}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.day}>{day}</Text>
            <MaterialIcons
              name="navigate-next"
              size={22}
              color={AppColors.primary}
              style={styles.icon}
            />
          </View>
          {!isTracking && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleStartTracking}>
              <Text style={styles.buttonTxt}>Clock In</Text>
            </TouchableOpacity>
          )}
          {isTracking && (
            <View style={styles.clockOutBtnContainer}>
              <TouchableOpacity
                style={styles.clockOutButton}
                onPress={handleStopTracking}>
                <Text style={styles.buttonTxt}>Clock Out</Text>
              </TouchableOpacity>
              <View style={styles.clockInTimeContainer}>
                <Text style={styles.clockInTimeText}>{clockInTime}</Text>
              </View>
            </View>
          )}
          <Text style={styles.shiftText}>
            Countious punch-in is active till 12:00 AM
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: '#fff',
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
  clockOutBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
});
