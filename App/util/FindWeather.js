///////////////////////////////////////////////////////////////////
// This file handles the two api calls that need to be made within
//  the app. 
// This App uses the openweathermap API available at 
//  https://openweathermap.org/api
///////////////////////////////////////////////////////////////////

import { apiKey } from '../CONFIG';

export const WeatherAPI = (path, { zip, coords, units }) => {
    let searchParameter = '';

    if (zip) {
        searchParameter = `&zip=${zip}`;
    } else if (coords) {
        searchParameter = `&lat=${coords.latitude}&lon=${coords.longitude}`
    }

    let apiAddress = `https://api.openweathermap.org/data/2.5${path}?appid=${apiKey}${searchParameter}&units=${units}`;
    console.log(apiAddress)

    // If the path matches either of the use cases return the fetched data
    if (path === '/forecast' || path === '/weather')
        return (
            fetch(apiAddress)
        )

}
