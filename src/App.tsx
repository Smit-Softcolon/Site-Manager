import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import Login from './screens/Login';
import SelectSite from './screens/SelectSite';
import HomePage from './screens/HomePage';
import {Provider} from 'react-redux';
import {store} from './state/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Attendance from './screens/Attendance';
import MapScreen from './screens/MapScreen';
import StaticMapLocation from './screens/StaticMapLocation';
import ActivityMap from './screens/ActivityMap';
import Messages from './screens/Messages';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './components/CustomDrawerContent';
import AppColors from './utils/AppColors';
import ExpanseScreen from './screens/ExpanseScreen';
import SiteDetails from './screens/SiteDetails';
import AddLeads from './screens/AddLeads';
import LocationLogs from './screens/LocationLogsTab';
import ApplyLeave from './screens/ApplyLeave';
import EditProfile from './screens/EditProfile';
import Profile from './screens/Profile';

export type RootStackParamList = {
  Login: undefined;
  SelectSite: undefined;
  Attendance: undefined;
  MapScreen: {
    type: string;
  };
  HomePage: {siteName: string};
  StaticMapLocation: {
    latitude: number;
    longitude: number;
    timestamp: string;
    source: string;
  };
  ActivityMap: any[];
  Messages: undefined;
  ExpanseScreen: undefined;
  SiteDetails: undefined;
  AddLeads: undefined;
  LocationLogs: undefined;
  ApplyLeave: undefined;
  EditProfile: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerBackTitle: 'Back',
          }}>
          <Stack.Screen
            name="Login"
            options={{headerShown: false, headerStyle: styles.headerStyle}}
            component={Login}
          />
          <Stack.Screen
            name="SelectSite"
            options={{headerShown: false}}
            component={SelectSite}
          />
          <Stack.Screen
            name="HomePage"
            options={({navigation}) => ({
              headerLeft: () => <View />,
              title: 'Home Page',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Messages');
                  }}>
                  <MaterialIcons name="notifications-active" size={24} />
                </TouchableOpacity>
              ),
            })}
            component={HomePage}
          />
          <Stack.Screen
            name="Attendance"
            options={{
              title: 'Attendance - Today',
              headerStyle: styles.headerStyle,
            }}
            component={Attendance}
          />
          <Stack.Screen
            name="MapScreen"
            options={{
              title: 'Map',
              headerStyle: styles.headerStyle,
            }}
            component={MapScreen}
          />
          <Stack.Screen
            name="StaticMapLocation"
            options={{
              title: 'Location',
              headerStyle: styles.headerStyle,
            }}
            component={StaticMapLocation}
          />
          <Stack.Screen
            name="ActivityMap"
            options={{
              title: 'Activity Map',
              headerStyle: styles.headerStyle,
            }}
            component={ActivityMap}
          />
          <Stack.Screen
            name="Messages"
            options={{
              title: 'Messages',
              headerStyle: styles.headerStyle,
            }}
            component={Messages}
          />
          <Stack.Screen
            name="ExpanseScreen"
            options={{
              title: 'Manage Expenses',
              headerStyle: styles.headerStyle,
            }}
            component={ExpanseScreen}
          />
          <Stack.Screen
            name="SiteDetails"
            options={{
              title: 'Site Details',
              headerStyle: styles.headerStyle,
            }}
            component={SiteDetails}
          />
          <Stack.Screen
            name="AddLeads"
            options={{
              title: 'Add Leads',
              headerStyle: styles.headerStyle,
            }}
            component={AddLeads}
          />
          <Stack.Screen
            name="LocationLogs"
            options={{
              title: 'Logs',
              headerStyle: styles.headerStyle,
            }}
            component={LocationLogs}
          />
          <Stack.Screen
            name="ApplyLeave"
            options={{
              title: 'Apply Leave',
              headerStyle: styles.headerStyle,
            }}
            component={ApplyLeave}
          />
          <Stack.Screen
            name="EditProfile"
            options={{
              title: 'Edit Profile',
              headerStyle: styles.headerStyle,
            }}
            component={EditProfile}
          />
          <Stack.Screen
            name="Profile"
            options={{
              title: 'Profile',
              headerStyle: styles.headerStyle,
            }}
            component={Profile}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFF',
    shadowOpacity: 0,
    elevation: 0,
  },
});
