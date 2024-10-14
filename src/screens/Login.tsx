import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppImages from '../utils/AppImages';
import AppColors from '../utils/AppColors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

const {width, height} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  password: Yup.string().required('Password is required'),
});

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation}: LoginProps) => {
  const handleLogin = (values: any) => {
    console.log(values);
    navigation.replace('HomePage', {siteName: 'Ananta'});
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={AppImages.KEY_LOGIN} style={styles.sticker} />
          <Text style={styles.title}>Login</Text>
          <Formik
            initialValues={{mobileNumber: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={handleLogin}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  keyboardType="phone-pad"
                  style={styles.inputField}
                  placeholder="Mobile Number"
                  onChangeText={handleChange('mobileNumber')}
                  onBlur={handleBlur('mobileNumber')}
                  value={values.mobileNumber}
                />
                {touched.mobileNumber && errors.mobileNumber && (
                  <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                )}
                <TextInput
                  keyboardType="visible-password"
                  style={styles.inputField}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.btnTxt}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sticker: {
    height: width * 0.5,
    width: width * 0.5,
  },
  button: {
    width: width * 0.85,
    height: 40,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: height * 0.03,
    elevation: 5,
    shadowOffset: {height: 3, width: 3},
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginVertical: height * 0.015,
  },
  inputField: {
    width: width * 0.85,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: height * 0.02,
    paddingLeft: 10,
  },
  btnTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: width * 0.075,
    marginTop: 5,
  },
});