import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../state/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppColors from '../utils/AppColors';
import {removeLeads} from '../state/leadsSlice';

const {width, height} = Dimensions.get('window');

const openWhatsApp = async (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');

  const webUrl = `https://wa.me/${cleanNumber}`;

  const url = `whatsapp://send?phone=${cleanNumber}`;

  try {
    if (Platform.OS === 'android') {
      await Linking.openURL(url);
    } else {
      const canOpenWhatsApp = await Linking.canOpenURL(
        `whatsapp://send?phone=${cleanNumber}`,
      );
      if (canOpenWhatsApp) {
        await Linking.openURL(webUrl);
      } else {
        const storeUrl = Platform.select({
          ios: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
          android: 'market://details?id=com.whatsapp',
          default: 'https://whatsapp.com',
        });
        await Linking.openURL(storeUrl);
      }
    }
  } catch (error) {
    console.error('Error:', error);

    // If the intent URL fails on Android, try opening Play Store
    if (Platform.OS === 'android') {
      try {
        await Linking.openURL('market://details?id=com.whatsapp');
      } catch (storeError) {
        // If market:// fails, open web Play Store
        await Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.whatsapp',
        );
      }
    } else {
      Alert.alert('Error', 'Something went wrong while opening WhatsApp', [
        {text: 'OK'},
      ]);
    }
  }
};

const AllLeads = () => {
  const dispatch = useDispatch();
  const leadsData = useSelector((state: RootState) => state.leads.leadsData);
  return (
    <View style={styles.rootContainer}>
      {leadsData.length > 0 ? (
        <FlatList
          data={leadsData}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.detailView}>
                <View style={styles.editView}>
                  <Text style={styles.nameTxt}>{item.name}</Text>
                  <Text style={styles.numberTxt}>{item.email}</Text>
                  {/* <TouchableOpacity
                    onPress={() => {
                      // dispatch(update({id: item.id}));
                    }}>
                    <MaterialIcons
                      style={styles.editIcon}
                      name="edit"
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity> */}
                </View>
                <Text style={styles.numberTxt}>Number: {item.number}</Text>
                {/* <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => {
                      // dispatch(remove({id: item.id}));
                    }}>
                    <FontAwesome
                      style={styles.editIcon}
                      name="whatsapp"
                      size={24}
                      color={AppColors.green}
                    />
                    <Text style={{color: AppColors.green}}>Message</Text>
                  </TouchableOpacity> */}
                <Text style={styles.numberTxt}>Feedback: {item.desc}</Text>
                <View style={styles.divider}></View>
                <View style={[styles.editView, {marginBottom: 5}]}>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => openWhatsApp(item.number)}>
                    <FontAwesome
                      style={styles.editIcon}
                      name="whatsapp"
                      size={24}
                      color={AppColors.green}
                    />
                    <Text style={{color: AppColors.green, fontWeight: 'bold'}}>
                      Message
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => {
                      // dispatch(remove({id: item.id}));
                    }}>
                    <MaterialIcons
                      style={styles.editIcon}
                      name="edit"
                      size={24}
                      color={AppColors.black}
                    />
                    <Text style={{color: AppColors.black, fontWeight: 'bold'}}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    onPress={() => {
                      Alert.alert(
                        'Delete',
                        'Are you sure you want to delete this lead?',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Delete',
                            onPress: () => {
                              dispatch(removeLeads({id: item.id}));
                            },
                          },
                        ],
                      );
                    }}>
                    <MaterialIcons
                      style={styles.editIcon}
                      name="delete"
                      size={24}
                      color={AppColors.red}
                    />
                    <Text style={{color: AppColors.red, fontWeight: 'bold'}}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
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

export default AllLeads;

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
  nameTxt: {
    fontWeight: 'bold',
    color: AppColors.primary,
    fontSize: 20,
  },
  editIcon: {
    marginRight: 7,
  },
  numberTxt: {
    fontSize: 16,
    marginTop: 5,
  },
  card: {
    width: width * 0.93,
    padding: 5,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.025,
    paddingTop: 10,
    borderRadius: 5,
    marginTop: height * 0.005,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#fff',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
    marginVertical: 10,
    width: width * 0.9,
  },
  msgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
