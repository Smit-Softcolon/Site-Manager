import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Expanse from '../components/Expanse';
import ExpanseHistory from '../components/ExpanseHistory';

const {width, height} = Dimensions.get('window');

const ExpanseScreen = () => {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Add Expense</Text>
      <Expanse />
      <Text style={styles.title}>Expenses History</Text>
      <View style={styles.historyView}>
        <ExpanseHistory />
      </View>
    </View>
  );
};

export default ExpanseScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: width,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    width: width * 0.95,
    fontSize: 18,
    fontWeight: '600',
    marginTop: height * 0.015,
    marginBottom: height * 0.015,
  },
  historyView: {
    marginBottom: height * 0.05,
  },
});
