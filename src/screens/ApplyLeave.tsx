import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppColors from '../utils/AppColors';
import LeaveHistory from '../components/LeaveHistory';
import {useDispatch} from 'react-redux';
import {addLeave} from '../state/leaveSlice';

const {width} = Dimensions.get('window');

const LeaveValidationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  leaveReason: Yup.string()
    .required('Leave reason is required')
    .min(10, 'Reason must be at least 10 characters'),
});

interface LeaveFormValues {
  startDate: Date | null;
  endDate: Date | null;
  leaveReason: string;
}

const ApplyLeave: React.FC = () => {
  const dispatch = useDispatch();
  const [showStartDatePicker, setShowStartDatePicker] =
    useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const initialValues: LeaveFormValues = {
    startDate: null,
    endDate: null,
    leaveReason: '',
  };

  const handleSubmit = (values: LeaveFormValues) => {
    try {
      const fromDt = format(values.startDate!, 'dd/MM/yyyy');
      const toDt = format(values.endDate!, 'dd/MM/yyyy');

      dispatch(
        addLeave({
          startDate: fromDt.toString(),
          endDate: toDt.toString(),
          leaveReason: values.leaveReason,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          initialValues={initialValues}
          validationSchema={LeaveValidationSchema}
          onSubmit={(values, {resetForm}) => {
            handleSubmit(values);
            resetForm();
          }}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <View style={styles.dateMainContainer}>
                <View style={styles.dateContainer}>
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.datePicker,
                        touched.startDate && errors.startDate
                          ? styles.errorInput
                          : null,
                      ]}
                      onPress={() => {
                        setShowStartDatePicker(!showStartDatePicker);
                        setShowEndDatePicker(false);
                      }}>
                      <Text>
                        {values.startDate
                          ? format(values.startDate, 'dd/MM/yyyy')
                          : 'Select Start Date'}
                      </Text>
                    </TouchableOpacity>
                    {touched.startDate && errors.startDate && (
                      <Text style={styles.errorText}>{errors.startDate}</Text>
                    )}
                  </View>

                  <View>
                    <TouchableOpacity
                      style={[
                        styles.datePicker,
                        touched.endDate && errors.endDate
                          ? styles.errorInput
                          : null,
                      ]}
                      onPress={() => {
                        setShowEndDatePicker(!showEndDatePicker);
                        setShowStartDatePicker(false);
                      }}
                      disabled={!values.startDate}>
                      <Text>
                        {values.endDate
                          ? format(values.endDate, 'dd/MM/yyyy')
                          : 'Select End Date'}
                      </Text>
                    </TouchableOpacity>
                    {touched.endDate && errors.endDate && (
                      <Text style={styles.errorText}>{errors.endDate}</Text>
                    )}
                  </View>
                </View>

                {showStartDatePicker && (
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerButtonContainer}>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowStartDatePicker(false)}>
                        <Text style={styles.datePickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowStartDatePicker(false)}>
                        <Text style={styles.datePickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={values.startDate || new Date()}
                      mode="date"
                      display="spinner"
                      minimumDate={new Date()}
                      onChange={(
                        event: DateTimePickerEvent,
                        selectedDate?: Date,
                      ) => {
                        if (selectedDate) {
                          setFieldValue('startDate', selectedDate);
                          if (values.endDate && selectedDate > values.endDate) {
                            setFieldValue('endDate', null);
                          }
                        }
                      }}
                    />
                  </View>
                )}

                {showEndDatePicker && (
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerButtonContainer}>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowEndDatePicker(false)}>
                        <Text style={styles.datePickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowEndDatePicker(false)}>
                        <Text style={styles.datePickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={values.endDate || new Date()}
                      mode="date"
                      display="spinner"
                      minimumDate={values.startDate || new Date()}
                      onChange={(
                        event: DateTimePickerEvent,
                        selectedDate?: Date,
                      ) => {
                        if (selectedDate) {
                          setFieldValue('endDate', selectedDate);
                        }
                      }}
                    />
                  </View>
                )}
              </View>

              <View>
                <TextInput
                  numberOfLines={5}
                  textAlignVertical="top"
                  style={[
                    styles.textInput,
                    touched.leaveReason && errors.leaveReason
                      ? styles.errorInput
                      : null,
                  ]}
                  placeholder="Enter leave reason"
                  value={values.leaveReason}
                  onChangeText={handleChange('leaveReason')}
                />
                {touched.leaveReason && errors.leaveReason && (
                  <Text style={styles.errorText}>{errors.leaveReason}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>Request Leave</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <Text style={styles.title}>Leave history</Text>
        <LeaveHistory />
      </ScrollView>
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  dateMainContainer: {
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  datePickerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  datePickerButton: {
    padding: 5,
  },
  datePickerButtonText: {
    color: AppColors.primary,
    fontSize: 16,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
  },
  datePicker: {
    width: width * 0.43,
    height: 40,
    borderColor: 'gray',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 15,
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    width: width * 0.9,
    minHeight: 100,
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  button: {
    width: width * 0.9,
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
});
