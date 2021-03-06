///////////////////////////////////////////////////////////////////////////////
// Async storage to track the recent searches an locations of a user for quick
//  viewing later.
///////////////////////////////////////////////////////////////////////////////

import { AsyncStorage } from "react-native";

const KEY = "@WeatherApp/searchHistory";

export const getRecentSearch = () =>
    AsyncStorage.getItem(KEY).then(str => {
        if (str) {
            return JSON.parse(str);
        }

        return [];
    });

export const addRecentSearch = item =>
    getRecentSearch().then(history => {
        const oldHistory = history.filter(
            existingItem => existingItem.id !== item.id
        );
        const newHistory = [item, ...oldHistory];

        return AsyncStorage.setItem(KEY, JSON.stringify(newHistory));
    });