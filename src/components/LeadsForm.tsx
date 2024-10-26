import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppColors from '../utils/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {add} from '../state/expanseSlice';
import {addLeads} from '../state/leadsSlice';

const {width, height} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  desc: Yup.string().required('Description is required'),
});

const LeadsForm = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{name: '', number: '', email: '', desc: ''}}
      validationSchema={validationSchema}
      onSubmit={(values, {resetForm}) => {
        resetForm();
        dispatch(
          addLeads({
            name: values.name,
            number: values.number,
            email: values.email,
            desc: values.desc,
          }),
        );
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="number-pad"
              style={[styles.inputField, {marginTop: 10}]}
              placeholder="Enter phone number"
              onChangeText={handleChange('number')}
              onBlur={handleBlur('number')}
              value={values.number}
            />
            {errors.number && touched.number && (
              <Text style={styles.errorText}>{errors.number}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputField, {marginTop: 10}]}
              placeholder="Enter email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputField, {marginTop: 10}]}
              placeholder="Enter description"
              onChangeText={handleChange('desc')}
              onBlur={handleBlur('desc')}
              value={values.desc}
            />
            {errors.desc && touched.desc && (
              <Text style={styles.errorText}>{errors.desc}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}>
            <Text style={styles.buttonTxt}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default LeadsForm;

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.95,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  addImageContainer: {
    flexDirection: 'row',
    width: width * 0.93,
    height: 40,
    borderColor: 'gray',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  crossButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    width: width * 0.93,
    height: width * 0.35,
    borderColor: 'gray',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  imageText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: width * 0.32,
    height: width * 0.32,
  },
  inputField: {
    width: width * 0.93,
    height: 40,
    borderColor: 'gray',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  button: {
    width: width * 0.4,
    height: 40,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 15,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});
