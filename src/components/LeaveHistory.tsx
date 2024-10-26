import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {removeLeave} from '../state/leaveSlice';

const {width, height} = Dimensions.get('window');

const LeaveHistory = () => {
  const leaveHistoryData = useSelector(
    (state: RootState) => state.leave.leaveRequests,
  );
  const dispatch = useDispatch();
  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={leaveHistoryData}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.leftContainer}>
              <Text style={styles.txt}>From: {item.fromDt}</Text>
              <Text style={styles.txt}>To: {item.toDt}</Text>
              <Text style={styles.txt}>Reason: {item.reason}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text
                style={[
                  styles.txt,
                  {
                    marginBottom: 5,
                    color:
                      item.status === 'Pending'
                        ? 'orange'
                        : item.status === 'Approved'
                        ? 'green'
                        : 'red',
                  },
                ]}>
                {item.status}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Delete Leave request',
                    'Are you sure you want to delete this leave request?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          dispatch(removeLeave({id: item.id}));
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <MaterialIcons name="delete" color={AppColors.red} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default LeaveHistory;

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: 'white',
    width: width,
  },
  card: {
    width: width * 0.9,
    borderRadius: 10,
    marginTop: height * 0.02,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    width: width * 0.65,
  },
  rightContainer: {
    width: width * 0.2,
    alignItems: 'center',
  },
  txt: {
    fontWeight: 'bold',
    color: AppColors.primary,
    fontSize: 16,
  },
  btn: {
    width: width * 0.15,
    height: 30,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
});
