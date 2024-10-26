import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Expanse from '../components/Expanse';
import ExpanseHistory from '../components/ExpanseHistory';
import LeadsForm from '../components/LeadsForm';
import AllLeads from '../components/AllLeads';

const {width, height} = Dimensions.get('window');

const AddLeads = () => {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Add Leads</Text>
      <LeadsForm />
      <Text style={styles.title}>All Leads</Text>
      <View style={styles.historyView}>
        <AllLeads />
      </View>
    </View>
  );
};

export default AddLeads;

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
