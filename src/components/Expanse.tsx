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

const {width, height} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .moreThan(0, 'Amount must be greater than 0'),
  description: Yup.string().required('Description is required'),
});

const Expense = () => {
  const [thumbnail, setThumbnail] = useState<{uri?: string}>({});
  const [isImageSelected, setIsImageSelected] = useState(false);
  const dispatch = useDispatch();

  const selectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    const result = await launchImageLibrary(options);
    if (!result.didCancel && result.assets) {
      const photoData = {
        uri: result.assets[0].uri,
        type: result.assets[0].type,
        name: result.assets[0].fileName,
      };
      setThumbnail(photoData);
      setIsImageSelected(true);
    }
    if (result.errorMessage) console.log('error');
  };

  return (
    <Formik
      initialValues={{amount: '', description: ''}}
      validationSchema={validationSchema}
      onSubmit={(values, {resetForm}) => {
        setIsImageSelected(false);
        setThumbnail({uri: ''});
        resetForm();
        dispatch(add({amount: values.amount, description: values.description}));
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="number-pad"
              style={styles.inputField}
              placeholder="Enter amount"
              onChangeText={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
            />
            {errors.amount && touched.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputField, {marginTop: 10}]}
              placeholder="Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
            {errors.description && touched.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {!isImageSelected && (
            <TouchableOpacity
              style={styles.addImageContainer}
              onPress={selectImage}>
              <MaterialIcons name="upload" size={22} color="black" />
              <Text style={styles.imageText}>Upload Image</Text>
            </TouchableOpacity>
          )}
          {isImageSelected && (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{uri: thumbnail?.uri}}
                resizeMode="cover"
              />
              <View style={styles.crossButton}>
                <MaterialIcons
                  name="cancel"
                  size={22}
                  color="red"
                  onPress={() => {
                    setIsImageSelected(false);
                    setThumbnail({uri: ''});
                  }}
                />
              </View>
            </View>
          )}

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

export default Expense;

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.95,
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
