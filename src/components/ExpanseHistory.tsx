import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../state/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {update} from '../state/expanseSlice';

const {width, height} = Dimensions.get('window');

const ExpanseHistory = () => {
  const expanseData = useSelector(
    (state: RootState) => state.expanses.expanseData,
  );
  const dispatch = useDispatch();
  return (
    <View style={styles.rootContainer}>
      {expanseData.length > 0 ? (
        <FlatList
          data={expanseData}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.editView}>
                <View style={styles.detailView}>
                  <Text style={styles.amount}>₹{item.amount}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    // dispatch(update({id: item.id}));
                  }}>
                  <MaterialIcons
                    style={styles.editIcon}
                    name="edit"
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noData}>
          No expanse history available. Please add some expanse to see history.
        </Text>
      )}
    </View>
  );
};

export default ExpanseHistory;

const styles = StyleSheet.create({
  noData: {
    textAlign: 'center',
    marginTop: 20,
    width: width * 0.8,
  },
  editView: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailView: {
    width: width * 0.75,
  },
  rootContainer: {
    width: width,
    alignItems: 'center',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  editIcon: {
    marginRight: 7,
  },
  desc: {
    fontSize: 16,
    marginTop: 5,
  },
  card: {
    width: width * 0.93,
    padding: 5,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.025,
    borderRadius: 5,
    marginTop: height * 0.005,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#fff',
  },
});
