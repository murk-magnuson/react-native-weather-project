/////////////////////////////////////////////////////////////////
// A screen to search for a locations weather based on zip code.
/////////////////////////////////////////////////////////////////

import React from 'react';
import { FlatList, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { SearchBar } from '../components/SearchBar';
import { SearchItem } from '../components/List';
import { getRecentSearch } from '../util/recentSearch';

class Search extends React.Component {
    state = {
        query: '',
        recentSearch: []
    };

    // When we navigate to this screen get the history of searches from AsyncStorage then store them in state.
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount() {
        getRecentSearch()
            .then(recentSearch => {
                this.setState({ recentSearch })
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <ScrollView>
                <View style={{ justifyContent: 'space-between', flexDirection: 'column', flex: 1 }}>
                    <View>
                        <FlatList
                            data={this.state.recentSearch}
                            renderItem={({ item }) => (
                                <SearchItem
                                    name={item.name}
                                    onPress={() => this.props.navigation.navigate('Details', {
                                        lat: item.lat,
                                        lon: item.lon
                                    })}
                                />
                            )}
                            keyExtractor={item => item.id.toString()}
                            ListHeaderComponent={(
                                <View>
                                    <SearchBar
                                        onSearch={() => {
                                            this.props.navigation.navigate('Details', {
                                                zipcode: this.state.query
                                            });
                                        }}
                                        searchButtonEnabled={this.state.query.length >= 5}
                                        placeHolder="Zipcode"
                                        onChangeText={query => this.setState({ query })}
                                    />
                                    <Text style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 5, fontSize: 16, color: '#aaa' }}>
                                        Recent
                        </Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }

}


export default Search;