import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import BackgroundFetch from "react-native-background-fetch";
import Geolocation from 'react-native-geolocation-service';
import { RootState } from "./store";

const initialState = {
    day: '',
    date: '',
    month: '',
    isTracking: false,
    clockInTime: '',
    latitude: 0,
    longitude: 0,
    locationDataList: [] as any[],
    timeOutId: null as NodeJS.Timeout | null
}

const FETCH_INTERVAL = 15 * 60 * 1000;

export const configureBackgroundFetch = createAsyncThunk(
    'map/configureBackgroundFetch',
    async (_, { getState, dispatch }) => {
        console.log('[BackgroundFetch] Configuring...');

        const state = getState() as RootState;

        try {
            BackgroundFetch.status(status => {
                console.log('[BackgroundFetch] Status:', status);
                console.log(status === BackgroundFetch.STATUS_RESTRICTED, "configureBackgroundFetch");
                console.log(status === BackgroundFetch.STATUS_AVAILABLE, "configureBackgroundFetch");
                console.log(status === BackgroundFetch.STATUS_DENIED, "configureBackgroundFetch");
            });

            await BackgroundFetch.configure(
                {
                    minimumFetchInterval: 15,
                    stopOnTerminate: false,
                    startOnBoot: true,
                    enableHeadless: true,
                    forceAlarmManager: false,
                },
                async taskId => {
                    console.log('[BackgroundFetch] Task: ', taskId);
                    console.log(state.mapData.isTracking, "configureBackgroundFetch");

                    if (state.mapData.isTracking) {
                        await dispatch(fetchAndAddLocation('background'));
                        console.log("background", Date.now());

                        // console.log('configureBackgroundFetch');
                    }
                    BackgroundFetch.finish(taskId);
                },
                error => {
                    console.log('[BackgroundFetch] Failed to configure:', error);
                },

            );
        } catch (error) {
            console.error('Failed to configure background fetch:', error);
        }
    }
);

export const setLastFetchTime = createAsyncThunk(
    'map/setLastFetchTime',
    async (time: number) => {
        try {
            console.log('setLastFetchTime', time);
            
            await AsyncStorage.setItem("LAST_FETCH_TIME", time.toString());
        } catch (error) {
            console.error('Error saving last fetch time:', error);
        }
    }
);

export const handleStopTracking = createAsyncThunk(
    'map/handleStopTracking',
    async (clearLocations: boolean, { getState, dispatch }) => {
        try {
            const state = getState() as RootState;

            dispatch(setIsTracking(false));
            await AsyncStorage.setItem('isTracking', 'false');
            await AsyncStorage.removeItem('lastTrackingDate');
            await AsyncStorage.removeItem('LAST_FETCH_TIME');
            if (clearLocations) await AsyncStorage.removeItem('locations');
            // console.log('Clearing timeout:', state.mapData.timeOutId);

            if (state.mapData.timeOutId) {
                // console.log("clearing timeout");

                clearTimeout(state.mapData.timeOutId);
            }
        } catch (error) {
            console.error('Failed to stop tracking:', error);
        }
    }
);

export const handleStartTracking = createAsyncThunk(
    'map/handleStartTracking',
    async (_, { getState, dispatch }) => {
        const today = new Date();
        const state = getState() as RootState;
        // await this.fetchAndAddLocation('foreground');
        // console.log('handleStartTracking');
        dispatch(setIsTracking(true));
        await AsyncStorage.setItem('isTracking', 'true');
        await AsyncStorage.setItem('lastTrackingDate', today.toDateString());
        const clockInTime = today.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
        dispatch(setTodaysClockInTime(clockInTime));
    }
);

export const fetchAndAddLocation = createAsyncThunk(
    'map/fetchAndAddLocation',
    async (source: string, { getState, dispatch }) => {
        console.log('fetchAndAddLocation', source);

        const state = getState() as RootState;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const midnightTime = 24 * 60;

        if (currentTime >= midnightTime - 1 && currentTime < midnightTime) {
            await dispatch(handleStopTracking(true));
            return;
        }

        Geolocation.getCurrentPosition(
            async (position: { coords: { latitude: any; longitude: any } }) => {
                const { latitude, longitude } = position.coords;
                dispatch(setLatitudeLongitude({ latitude, longitude }));
                const timestamp = new Date().toISOString();
                const locationData = { latitude, longitude, timestamp, source };

                try {
                    console.log("smit");

                    // Get existing locations
                    const existingLocations = await AsyncStorage.getItem('locations');
                    const locations = existingLocations
                        ? JSON.parse(existingLocations)
                        : [];

                    // Add new location
                    locations.push(locationData);

                    // console.log('Location:', locations);


                    dispatch(setLocationList(locations));

                    // Store updated locations
                    await AsyncStorage.setItem('locations', JSON.stringify(locations));
                    await dispatch(setLastFetchTime(Date.now()));
                } catch (error) {
                    console.error('Failed to store location:', error);
                }
            },
            (error: any) => {
                console.log('Error getting location:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }
);

export const fetchLocation = createAsyncThunk(
    'map/fetchLocation',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;

        return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position: { coords: { latitude: number; longitude: number } }) => {
                    const { latitude, longitude } = position.coords;
                    // Dispatch action to update state with new coordinates
                    dispatch(setLatitudeLongitude({ latitude, longitude }));
                    resolve({ latitude, longitude });
                    // console.log(latitude, longitude, "fetchLocation");

                },
                (error: any) => {
                    console.log('Error getting location:', error);
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    }
);

export const setupLocationFetching = createAsyncThunk(
    'map/setupLocationFetching',
    async (_, { dispatch, getState }) => {
        const state = getState() as RootState;

        const lastFetchTime = await dispatch(getLastFetchTime()).unwrap();
        console.log('Last fetch time:', lastFetchTime);
        

        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime;
        console.log('Time since last fetch:', timeSinceLastFetch, FETCH_INTERVAL);


        if (timeSinceLastFetch >= FETCH_INTERVAL) {
            // If it's been more than 15 minutes since the last fetch, fetch immediately
            if (state.mapData.isTracking) {
                await dispatch(fetchAndAddLocation('foreground'));
            }
        } else {
            // Otherwise, set a timeout for the remaining time
            const remainingTime = FETCH_INTERVAL - timeSinceLastFetch;
            console.log('Remaining time:', remainingTime);

            if (state.mapData.isTracking) await dispatch(scheduleNextFetch(remainingTime));
        }
    }
);

export const getLastFetchTime = createAsyncThunk(
    'map/getLastFetchTime',
    async () => {
        try {
            const lastFetchTime = await AsyncStorage.getItem("LAST_FETCH_TIME");
            console.log('getLastFetchTime', lastFetchTime);

            return lastFetchTime ? parseInt(lastFetchTime) : 0;
        } catch (error) {
            console.error('Error reading last fetch time:', error);
            return 0;
        }
    }
);

export const scheduleNextFetch = createAsyncThunk(
    'map/scheduleNextFetch',
    async (delay: number, { getState, dispatch }) => {
        // console.log('Scheduling next fetch in', delay, 'ms');

        const state = getState() as RootState;
        if (state.mapData.timeOutId) {
            clearTimeout(state.mapData.timeOutId);
        }
        try {
            var timeOutId = setTimeout(async () => {
                await dispatch(fetchAndAddLocation('foreground'));
                await dispatch(scheduleNextFetch(FETCH_INTERVAL));
            }, delay);
            dispatch(setTimeoutId(timeOutId));
        } catch (error) {
            console.error('Failed to schedule next fetch:', error);
        }
    }
);

export const MapSlice = createSlice({
    name: 'Map',
    initialState,
    reducers: {
        setDayDateMonth: (state, action: PayloadAction<{ day: string, date: string, month: string }>) => {
            state.day = action.payload.day;
            state.date = action.payload.date;
            state.month = action.payload.month;
        },
        setLatitudeLongitude: (state, action: PayloadAction<{ latitude: number, longitude: number }>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        },
        setIsTracking: (state, action: PayloadAction<boolean>) => {
            state.isTracking = action.payload;
            if (action.payload) {
                BackgroundFetch.start();
            } else {
                BackgroundFetch.stop();
            }
        },
        setTodaysClockInTime: (state, action: PayloadAction<string>) => {
            state.clockInTime = action.payload;
        },
        setLocationList: (state, action: PayloadAction<any[]>) => {
            action.payload.forEach((location) => {

                var id = Math.random().toString(36).substring(7);

                location.id = id;

                // console.log(location, "setLocationList");

                state.locationDataList.push(location);
            });
        },
        setTimeoutId: (state, action: PayloadAction<NodeJS.Timeout>) => {
            state.timeOutId = action.payload;
        }
    }
});

export const { setDayDateMonth, setIsTracking, setTodaysClockInTime, setLatitudeLongitude, setLocationList, setTimeoutId } = MapSlice.actions;

export default MapSlice.reducer;