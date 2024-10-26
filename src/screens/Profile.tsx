import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainerProps} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const {width, height} = Dimensions.get('window');

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = ({navigation}: ProfileProps) => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Primary Details</Text>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfile');
          }}>
          <MaterialIcons name="edit" size={22} color={AppColors.primary} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text>Name</Text>
          <Text numberOfLines={1} style={styles.fieldValueTxt}>
            Smit Chavda
          </Text>
        </View>
        <View style={styles.detailInnerContainer}>
          <Text>Contact number</Text>
          <Text numberOfLines={1} style={styles.fieldValueTxt}>
            6355295355
          </Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text>Email</Text>
          <Text numberOfLines={1} style={styles.fieldValueTxt}>
            smitsoftcolon@gmail.com
          </Text>
        </View>
        <View style={styles.detailInnerContainer}>
          <Text>Date of Birth</Text>
          <Text numberOfLines={1} style={styles.fieldValueTxt}>
            07 Jan, 2003
          </Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text>Date of Joinning</Text>
          <Text numberOfLines={1} style={styles.fieldValueTxt}>
            23 Feb, 2023
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.header,
          {marginTop: height * 0.03, alignSelf: 'flex-start'},
        ]}>
        Documents
      </Text>
      <Text style={styles.title}>Aadhaar card</Text>
      <TouchableOpacity style={styles.docBtn}>
        <Text style={styles.docBtnTxt}>Upload your Aadhaar card</Text>
      </TouchableOpacity>
      <Text style={[styles.title, {marginTop: 15}]}>Pan card</Text>
      <TouchableOpacity style={styles.docBtn}>
        <Text style={styles.docBtnTxt}>Upload your Pan card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.03,
    paddingTop: height * 0.015,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  textBtn: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldValueTxt: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: 'bold',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.015,
  },
  detailInnerContainer: {
    width: width * 0.44,
  },
  title: {
    marginTop: height * 0.005,
    fontSize: 14,
  },
  docBtn: {
    width: width * 0.93,
    borderColor: AppColors.primary,
    borderWidth: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: height * 0.005,
  },
  docBtnTxt: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
