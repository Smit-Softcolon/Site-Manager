// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React from 'react';
// import AppColors from '../utils/AppColors';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {RootStackParamList} from '../App';
// import {Formik} from 'formik';
// import * as Yup from 'yup';

// const {width, height} = Dimensions.get('window');

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   number: Yup.string()
//     .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
//     .required('Mobile number is required'),
//   dob: Yup.string().required('Date of Birth is required'),
// });

// const EditProfile = () => {
//   return (
//     <View style={styles.rootContainer}>
//       <Formik
//         initialValues={{name: '', email: '', number: '', dob: ''}}
//         validationSchema={validationSchema}
//         onSubmit={(values, {resetForm}) => {
//           setIsImageSelected(false);
//           setThumbnail({uri: ''});
//           resetForm();
//           dispatch(
//             add({amount: values.amount, description: values.description}),
//           );
//         }}>
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <View style={styles.mainContainer}>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 keyboardType="number-pad"
//                 style={styles.inputField}
//                 placeholder="Enter amount"
//                 onChangeText={handleChange('amount')}
//                 onBlur={handleBlur('amount')}
//                 value={values.amount}
//               />
//               {errors.amount && touched.amount && (
//                 <Text style={styles.errorText}>{errors.amount}</Text>
//               )}
//             </View>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[styles.inputField, {marginTop: 10}]}
//                 placeholder="Description"
//                 onChangeText={handleChange('description')}
//                 onBlur={handleBlur('description')}
//                 value={values.description}
//               />
//               {errors.description && touched.description && (
//                 <Text style={styles.errorText}>{errors.description}</Text>
//               )}
//             </View>

//             {!isImageSelected && (
//               <TouchableOpacity
//                 style={styles.addImageContainer}
//                 onPress={selectImage}>
//                 <MaterialIcons name="upload" size={22} color="black" />
//                 <Text style={styles.imageText}>Upload Image</Text>
//               </TouchableOpacity>
//             )}
//             {isImageSelected && (
//               <View style={styles.imageContainer}>
//                 <Image
//                   style={styles.image}
//                   source={{uri: thumbnail?.uri}}
//                   resizeMode="cover"
//                 />
//                 <View style={styles.crossButton}>
//                   <MaterialIcons
//                     name="cancel"
//                     size={22}
//                     color="red"
//                     onPress={() => {
//                       setIsImageSelected(false);
//                       setThumbnail({uri: ''});
//                     }}
//                   />
//                 </View>
//               </View>
//             )}

//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => handleSubmit()}>
//               <Text style={styles.buttonTxt}>Add</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Formik>
//     </View>
//   );
// };

// export default EditProfile;

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//     width: width,
//     paddingHorizontal: width * 0.03,
//     paddingTop: height * 0.015,
//   },
// });

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const EditProfile = () => {
  return (
    <View>
      <Text>EditProfile</Text>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
