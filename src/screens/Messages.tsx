import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Icon from 'react-native-vector-icons/MaterialIcons';

type messagesProps = NativeStackScreenProps<RootStackParamList, 'Messages'>;
const {width} = Dimensions.get('window');

interface MessageItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

const dummyMessages: MessageItem[] = [
  {
    id: '1',
    title: 'Meeting Schedule',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    title: 'Project Update',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    timestamp: '11:45 AM',
  },
  {
    id: '3',
    title: 'Team Discussion',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    timestamp: '2:15 PM',
  },
];

const MessageItem = ({item}: {item: MessageItem}) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue: expanded ? 1 : 0,
        useNativeDriver: false,
        friction: 15,
      }),
      Animated.spring(animatedRotate, {
        toValue: expanded ? 1 : 0,
        useNativeDriver: true,
        friction: 15,
      }),
    ]).start();
  }, [expanded]);

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const rotateInterpolate = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setExpanded(!expanded)}>
          <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
            <Icon name="keyboard-arrow-down" size={24} color="#666" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <View style={styles.divider} />

      <Animated.View style={[styles.content, {height: heightInterpolate}]}>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

const Messages = ({navigation}: messagesProps) => {
  return (
    <View style={styles.container}>
      {dummyMessages.map(item => (
        <MessageItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  content: {
    overflow: 'hidden',
  },
  description: {
    padding: 16,
    paddingTop: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
