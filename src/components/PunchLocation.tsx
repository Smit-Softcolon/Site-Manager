import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import formatDate, {dateFormator} from '../utils/FormateDate';

const {width, height} = Dimensions.get('window');

const PunchLocation = () => {
  const punchList = useSelector(
    (state: RootState) => state.mapData.locationDataList,
  );
  console.log('punchList', punchList);

  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 5}}>Location Punch</Text>
      <FlatList
        style={{marginBottom: height * 0.2}}
        data={punchList}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          var time = dateFormator(item.timestamp);
          return (
            <View>
              <Text>{time}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default PunchLocation;

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.01,
  },
});
