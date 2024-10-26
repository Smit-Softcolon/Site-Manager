// CustomDrawerContent.js
import React, {useEffect} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import AppImages from '../utils/AppImages';
import AppColors from '../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../state/store';

const CustomDrawerContent = (props: any) => {
  const [userName, setUserName] = React.useState('');
  const dispatch = useDispatch();
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          onPress: async () => {
            return props.navigation.reset({
              index: 0,
              routes: [{name: 'StartScreen'}],
            });
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{userName}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        icon={({color, size}) => (
          <MaterialIcons name="logout" color={color} size={size} />
        )}
        onPress={handleLogout}
        labelStyle={styles.logoutLable}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 10,
    color: 'black',
  },
  profileEmail: {
    fontSize: 14,
    color: 'gray',
  },
  logoutLable: {color: 'gray', opacity: 0.6},
});

export default CustomDrawerContent;
