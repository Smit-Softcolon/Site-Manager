import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import AppColors from '../utils/AppColors';
import AppImages from '../utils/AppImages';

const {width, height} = Dimensions.get('window');

const SiteDetails = () => {
  const [showAllImages, setShowAllImages] = useState(false);

  const images = [
    AppImages.SITE1,
    AppImages.SITE2,
    AppImages.SITE1,
    AppImages.SITE2,
    AppImages.SITE1,
    AppImages.SITE2,
  ];
  const imagesToDisplay = showAllImages ? images : images.slice(0, 2);

  const openGoogleMaps = () => {
    const latitude = 23.060588309139188;
    const longitude = 72.9454269;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url);
    } else {
      console.error('Failed to generate map URL');
    }
  };

  const shareAddress = async () => {
    const message = `Ananta pool villa and weekend home.\n\n Narmada canal Touch, Apruji Village, Ahmedabad, Gujarat 387610.
Coordinates: 23.060588309139188, 72.9454269
Visit: https://g.co/kgs/7fCWTSK`;

    const options = {
      title: 'Share Address and Images',
      message,
    };

    try {
      await Share.share(options);
    } catch (error) {
      console.log('Error sharing content:', error);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView>
        <Text style={styles.title}>Photos</Text>
        {imagesToDisplay.length !== 0 ? (
          <View style={styles.imageContainer}>
            {imagesToDisplay.map((image, index) => (
              <View key={index} style={{marginVertical: 5}}>
                <Image source={image} style={styles.image} />
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataTxt}>No images available</Text>
        )}
        {!showAllImages && images.length > 2 && (
          <TouchableOpacity
            onPress={() => setShowAllImages(true)}
            style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, {paddingTop: 10}]}>Brochure</Text>
        <Text style={styles.noDataTxt}>No brochure available</Text>
        <Text style={[styles.title, {paddingTop: 10}]}>Address</Text>
        <TouchableOpacity style={styles.mapContainer} onPress={openGoogleMaps}>
          <MapView
            style={styles.map}
            scrollEnabled={false}
            initialRegion={{
              latitude: 23.060588309139188,
              longitude: 72.9454269,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: 23.060588309139188,
                longitude: 72.9454269,
              }}
            />
          </MapView>
        </TouchableOpacity>
        <View style={styles.addressContainer}>
          <Text style={styles.addressTxt}>
            Narmada canal Touch, Apruji Village, Ahemedabad, Gujarat 387610
          </Text>
          <TouchableOpacity style={styles.btn} onPress={shareAddress}>
            <Text
              style={{
                color: AppColors.white,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SiteDetails;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: width,
    paddingHorizontal: width * 0.04,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  addressTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
    paddingTop: 10,
    width: width * 0.7,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 7,
  },
  image: {
    width: width * 0.45,
    height: height * 0.2,
    borderRadius: 10,
  },
  viewMoreButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataTxt: {
    textAlign: 'center',
    marginVertical: height * 0.01,
    width: width,
    fontSize: 16,
  },
  mapContainer: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  btn: {
    padding: 5,
    borderRadius: 10,
    width: width * 0.2,
    height: height * 0.05,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
