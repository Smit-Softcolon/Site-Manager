import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './screens/Login';
import SelectSite from './screens/SelectSite';
import HomePage from './screens/HomePage';
import {Provider} from 'react-redux';
import {store} from './state/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Attendance from './screens/Attendance';

export type RootStackParamList = {
  Login: undefined;
  SelectSite: undefined;
  HomePage: {
    siteName: string;
  };
  Attendance: undefined;
  MapScreen: undefined;
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
            options={{
              headerLeft: () => <View />,
              title: 'Home Page',
              headerRight: () => (
                <MaterialIcons name="notifications-active" size={24} />
              ),
              headerStyle: styles.headerStyle,
            }}
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
