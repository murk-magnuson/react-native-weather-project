import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Details from './screens/Details';
import Search from './screens/Search';

const HeaderRightButton = ({ onPress, style, icon }) => (
    <TouchableOpacity onPress={onPress}>
        <Image
            source={icon}
            resizeMode='contain'
            style={[
                {
                    marginRight: 10,
                    width: 20,
                    height: 20
                },
                style
            ]}
        />
    </TouchableOpacity>
);

const AppStack = createStackNavigator(
    {
        Details: {
            screen: Details,
            navigationOptions: ({ navigation }) => ({
                headerTitle: navigation.getParam('title', 'Awaiting . . .'),
                headerRight: <HeaderRightButton onPress={() => navigation.navigate('Search')} icon={require('./assets/search.png')} />,
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#3145b7',
                    borderBottomColor: '#3145b7',
                    shadowColor: '#3145b7',
                    shadowOpacity: 0,
                }
            })
        },
        Search: {
            screen: Search,
            navigationOptions: ({ navigation }) => ({
                headerTitle: 'Search',
                headerRight: <HeaderRightButton onPress={() => navigation.pop()} icon={require('./assets/close.png')} />,
                headerLeft: null,
            })
        }
    },
    {
        mode: 'modal'
    }
);

export default createAppContainer(AppStack);