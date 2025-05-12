import React from 'react';
import {Text, View} from 'react-native';

import Avator from '../../../components/Avator';
import Style from '../../../style';

class Default extends React.Component {
    _renderContent = () => {
        const {data} = this.props;

        return (
            <View style={[Style.row, Style.column_center]}>
                <Avator user={data} isLink={false} size={40} />
                <View style={[Style.column, Style.m_l_3]}>
                    {data.name && (
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_1,
                                Style.f_weight_600,
                                Style.f_fa_pf,
                                Style.m_t_1,
                            ]}
                            numberOfLines={1}>
                            {data.name}
                        </Text>
                    )}
                    {data.intro && (
                        <Text
                            style={[
                                Style.f_size_10,
                                Style.f_color_6,
                                Style.f_weight_400,
                                Style.f_fa_pf,
                                Style.m_t_1,
                            ]}
                            numberOfLines={2}>
                            {data.intro}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    render() {
        return <View>{this._renderContent()}</View>;
    }
}

export default Default;
