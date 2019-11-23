/////////////////////////////////////////////////////////////////////////////////
// Main screen that shows the weather of the location by image, the temperature,
//  and the high and low temps for several days of the week. Due to the weird
//  API sometimes it shows yesterdays weather.
/////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { ActivityIndicator, ScrollView, SafeAreaView, View, Alert, TouchableOpacity, Text } from 'react-native';
import { format, isToday } from 'date-fns';

import { WeatherAPI } from '../util/FindWeather';
import { Container } from '../components/Container';
import { WeatherIcon } from '../components/WeatherIcon';
import { BasicRow } from '../components/List';
import { H1, H2, P } from '../components/Text';
import { addRecentSearch } from '../util/recentSearch';
import WeatherType from '../util/weatherColor';

// This function takes the data that we get back from the API and separates it into
//  a more standard way of viewing date and temp data.
////////////////////////////////////////////////////////////////////////////////////
const groupForecastByDay = list => {
    const data = {};
    list.forEach(item => {
        const [day] = item.dt_txt.split(" ");

        if (data[day]) {
            if (data[day].temp_max < item.main.temp_max) {
                data[day].temp_max = item.main.temp_max;
            }
            if (data[day].temp_min > item.main.temp_min) {
                data[day].temp_min = item.main.temp_min;
            }
        } else {
            data[day] = {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max
            };
        }
    });
    const formattedList = Object.keys(data).map(key => ({
        day: key,
        ...data[key]
    }))

    return formattedList;
}


export default class Details extends React.Component {
    state = {
        currentWeather: {},
        loadingCurrentWeather: true,
        forecast: [],
        loadingForecast: true,
        units: "imperial",
        previousUse: "coords",
        coords: []
    }

    // Function that calls the weather API, then takes the response and sets our state details to it.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentWeather({ coords, zip }) {
        WeatherAPI('/weather', { coords: coords, zip: zip, units: this.state.units })
            .then(response => response.json())
            .then(response => {
                if (response.cod === '404') {
                    this.handleError();
                } else {
                    this.props.navigation.setParams({ title: response.name });
                    this.setState({ currentWeather: response, loadingCurrentWeather: false });
                    addRecentSearch({
                        id: response.name,
                        name: response.name,
                        lat: response.coord.lat,
                        lon: response.coord.lon
                    });
                }
            })
            .catch(err => {
                console.log('current error', err);
            })
    }

    // Function that calls the forecast API, then takes the response and sets our state 
    //  forecast to it. This API is strange as it sometimes returns days old data.
    ////////////////////////////////////////////////////////////////////////////////////
    getForecast({ coords, zip }) {
        WeatherAPI('/forecast', { coords: coords, zip: zip, units: this.state.units })
            .then(response => response.json())
            .then(response => {
                const formattedBoy = groupForecastByDay(response.list);
                this.setState({ forecast: formattedBoy, loadingForecast: false });
            })
            .catch(err => {
                console.log(err);
            })
    }

    // When the component is mounted, if the app has permission, grab the coordinates of
    //  the user and request info from the API
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(position => {
            this.getCurrentWeather({ coords: position.coords });
            this.getForecast({ coords: position.coords });
            this.setState({ coords: position.coords })
            console.log('done')
        });
    }

    // Checks the previous values of the app to see if anything has changed and recalls the API.
    //  Things that could have changed between previous and current are the location the user
    //  wants to see the weather of, or the units that the user wants to see.
    componentDidUpdate(prevProps, prevState) {
        const oldZip = prevProps.navigation.getParam('zipcode');
        const zip = this.props.navigation.getParam('zipcode');
        const oldLat = prevProps.navigation.getParam('lat');
        const lat = this.props.navigation.getParam('lat');
        const oldLon = prevProps.navigation.getParam('lon');
        const lon = this.props.navigation.getParam('lon');
        const oldUnit = prevState.units;


        if (lat && lon && oldLat !== lat && oldLon !== lon) {
            this.setState({ loadingCurrentWeather: true, loadingForecast: true, previousUse: 'coords' });
            const coords = {
                latitude: lat,
                longitude: lon
            };
            this.getCurrentWeather({ coords: coords, units: this.state.units });
            this.getForecast({ coords: coords, units: this.state.units });
        } else if (zip && oldZip !== zip) {
            this.setState({ loadingCurrentWeather: true, loadingForecast: true, previousUse: 'zip' });
            this.getCurrentWeather({ zip: zip, units: this.state.units });
            this.getForecast({ zip: zip, units: this.state.units });
        } else if (this.state.units != oldUnit) {
            type = this.state.previousUse;

            switch (type) {
                case 'zip':
                    this.getCurrentWeather({ zip: oldZip, units: this.state.units });
                    this.getForecast({ zip: oldZip, units: this.state.units });
                    break;
                case 'coords':
                    const coords = {
                        latitude: this.state.coords.latitude,
                        longitude: this.state.coords.longitude
                    };
                    this.getCurrentWeather({ coords: coords, units: this.state.units });
                    this.getForecast({ coords: coords, units: this.state.units });
            }
        }
    }

    // Just an error handler to let the user know if something went wrong.
    ///////////////////////////////////////////////////////////////////////
    handleError = () => {
        Alert.alert('No location data found!', 'Please Try Again', [
            {
                text: 'Okay',
                onPress: () => this.props.navigation.navigate('Search')
            }
        ]);
    };

    // Function that inverts the units that the user is seeing temperature in.
    ///////////////////////////////////////////////////////////////////////////
    switchUnit = () => {
        switch (this.state.units) {
            case 'imperial':
                this.setState({ units: 'metric' });
                break;
            case 'metric':
                this.setState({ units: 'imperial' });
                break;
        }
    }

    render() {
        if (this.state.loadingCurrentWeather || this.state.loadingForecast)
            return (
                // Shows a loading ring while we wait for the API to respond
                <Container>
                    <ActivityIndicator color='#fff' size='large' />
                </Container>
            )

        const { weather, main } = this.state.currentWeather;
        return (
            <Container style={{ backgroundColor: '#3145b7' }}>
                <ScrollView>
                    <SafeAreaView>
                        <WeatherIcon icon={weather[0].icon} tint={WeatherType(weather[0].icon)} />
                        <H1>{Math.round(main.temp)}°</H1>
                        <BasicRow>
                            <H2>   Low  </H2>
                            <H2>   High </H2>
                            <H2>Humidity</H2>
                        </BasicRow>
                        <BasicRow>
                            <H2>{Math.round(main.temp_min)}°</H2>
                            <H2>{Math.round(main.temp_max)}°</H2>
                            <H2>{main.humidity}%</H2>
                        </BasicRow>
                        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                            {this.state.forecast.map(day => {
                                return (
                                    <View key={day.day} >
                                        {isToday(new Date(day.day), 'EEEE, MMM d') ? <View></View> :
                                            <BasicRow style={{ justifyContent: 'space-between' }}>
                                                <P>{format(new Date(day.day), 'EEEE, MMM d')}</P>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <P style={{ fontWeight: '700', marginRight: 10 }}>{Math.round(day.temp_min)}</P>
                                                    <P>{Math.round(day.temp_max)}</P>
                                                </View>
                                            </BasicRow>
                                        }
                                    </View>
                                );
                            })}
                        </View>
                    </SafeAreaView>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => { this.switchUnit() }}
                >
                    <Text style={{ fontSize: 40, paddingBottom: 15, paddingLeft: 15, color: '#fff' }}>
                        {`${this.state.units}`}
                    </Text>
                </TouchableOpacity>
            </Container>
        );
    }
}