import ALL_APIS from "../network/apis";
import Geocoder from 'react-native-geocoding';

const getAddresses = async (latitude: number, longitude: number) => {
    try {
        Geocoder.init(ALL_APIS.MAP_KEY, { language: 'en' });
        const response = await Geocoder.from(latitude, longitude);
        if (response.results.length > 0) {
            const address = response.results[0].formatted_address;
            return address;
        } else {
            throw new Error('No address found for the given coordinates.');
        }
    } catch (error) {
        console.error(error);
    }
}

const getCityAndState = async (latitude: number, longitude: number) => {
    try {
        Geocoder.init(ALL_APIS.MAP_KEY, { language: 'en' });
        const response = await Geocoder.from(latitude, longitude);
        if (response.results.length > 0) {
            const address = response.results[0].address_components;
            const city = address.find((component: any) => component.types.includes('locality'));
            const state = address.find((component: any) => component.types.includes('administrative_area_level_1'));
            if (city && state) {
                return `${city.long_name}, ${state.long_name}`;
            } else {
                throw new Error('City or state not found for the given coordinates.');
            }
        } else {
            throw new Error('No address found for the given coordinates.');
        }
    } catch (error) {
        console.error(error);
    }
}

export { getCityAndState };

export default getAddresses;