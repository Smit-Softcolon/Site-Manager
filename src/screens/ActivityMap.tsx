import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import getAddresses, {getCityAndState} from '../utils/GetAddress';
import formatDate, {dateFormator} from '../utils/FormateDate';

const {height} = Dimensions.get('window');

type ActivityMapProps = NativeStackScreenProps<
  RootStackParamList,
  'ActivityMap'
>;

// Dummy data with 5 locations forming a route
const dummyLocations = [
  {
    latitude: 28.6139, // Delhi
    longitude: 77.209,
    timestamp: new Date().toISOString(),
    source: 'In',
  },
  {
    latitude: 28.6129, // Slightly south
    longitude: 77.227,
    timestamp: new Date().toISOString(),
    source: 'Punch',
  },
  {
    latitude: 28.6219, // Slightly northeast
    longitude: 77.238,
    timestamp: new Date().toISOString(),
    source: 'Punch',
  },
  {
    latitude: 28.6319, // Further northeast
    longitude: 77.248,
    timestamp: new Date().toISOString(),
    source: 'Punch',
  },
  {
    latitude: 28.6339, // Final destination
    longitude: 77.259,
    timestamp: new Date().toISOString(),
    source: 'Out',
  },
];

const ActivityMap = ({route}: ActivityMapProps) => {
  const locationPoints: any[] =
    route.params.length > 0 ? [...route.params] : dummyLocations;

  const getMarkerTitle = (point: any, index: number) => {
    const sourceInfo =
      point.source !== 'Punch' ? `Remote Clock ${point.source}` : 'Punch';
      const time = dateFormator(point.timestamp);
    return sourceInfo + " at " + time;
  };

  // Initial region will be centered on the first location point
  const initialRegion = {
    latitude: locationPoints[0]?.latitude || 0,
    longitude: locationPoints[0]?.longitude || 0,
    latitudeDelta: 0.01, // Default zoom level
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}>
        <Polyline
          coordinates={locationPoints}
          strokeColor="red"
          strokeWidth={3}
        />

        {locationPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={getMarkerTitle(point, index)}
            pinColor={
              index === 0
                ? 'green'
                : index === locationPoints.length - 1
                ? 'red'
                : 'orange'
            }
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: height,
  },
});

export default ActivityMap;
