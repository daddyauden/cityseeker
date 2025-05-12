import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';
import {HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
import FlatListView from '../../components/FlatListView';
import PostButton from '../../components/PostButton';
import SearchBar from '../../components/SearchBar';
import Style from '../../style';
import I18n from '../../locale';

class Home extends React.Component {
    static navigationOptions = () => {
        return {
            title: I18n.t('app.tab.rental_home'),
        };
    };

    constructor(props) {
        super(props);

        const {area, lat} = props.system;

        const {city} = area;

        this.state = {
            select: [
                'id',
                'name',
                'banner',
                'address',
                'bedrooms',
                'bathrooms',
                'property_type',
                'date_available',
                'price',
                'rent_type',
                'views',
                'type',
            ],
            where: [
                "type = 'rental' and rent_type ='home'",
                "city = '" + city + "'",
                'status = 1',
            ],
            order: lat
                ? ['distance asc', 'views desc', 'add_time asc']
                : ['views desc', 'add_time asc'],
        };
    }

    render() {
        return (
            <SafeAreaView
                style={[Style.flex, Style.theme_content]}
                forceInset={{vertical: 'never'}}>
                <StatusBar
                    hidden={HIDE_STATUS}
                    barStyle="dark-content"
                    translucent={TRANSLUCENT_STATUS}
                />
                <SearchBar {...this.props} />
                <FlatListView {...this.state} {...this.props} />
                <PostButton post_type="rental" {...this.props} />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.account,
        system: state.system,
    };
}

export default connect(mapStateToProps)(Home);
