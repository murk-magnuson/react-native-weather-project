////////////////////////////////////////////
// Just a file for dynamically coloring the
//  weather icons.
////////////////////////////////////////////

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    sunny: {
        tintColor: '#fcba03'
    },
    cloudy: {
        tintColor: '#536b78'
    },
    rainy: {
        tintColor: '#2f34a1'
    },
    snowy: {
        tintColor: '#7dbcbd'
    },
    stormy: {
        tintColor: '#161729'
    },
    night: {
        tintColor: '#283a78'
    }
})

const weatherType = (icon) => {
    switch (icon) {
        case '01d':
            return styles.sunny;
        case '01n':
        case '02n':
            return styles.night;
        case '02d':
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return styles.cloudy;
        case '09d':
        case '09n':
        case '10d':
        case '10n':
            return styles.rainy;
        case '11d':
        case '11n':
            return styles.stormy;
        case '13d':
        case '13n':
            return styles.snowy;
        default:
            return {};
    }
}

export default weatherType;