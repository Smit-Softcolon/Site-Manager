import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './screens/Login';
import SelectSite from './screens/SelectSite';
import HomePage from './screens/HomePage';

export type RootStackParamList = {
  Login: undefined;
  SelectSite: undefined;
  HomePage: {
    siteName: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerBackTitle: 'Back',
        }}>
        <Stack.Screen
          name="Login"
          options={{headerShown: false}}
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
          }}
          component={HomePage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {},
});
