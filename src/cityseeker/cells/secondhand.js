import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Platform,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ShareButton from '../components/ShareButton';
import {Common} from '../utils/lib';
import I18n from '../locale';

class Secondhand extends Component {
    state = {
        contentHeight: 0,
        active: false,
    };

    get image() {
        const {banner, images} = this.props.data;

        let component = null;

        if (images && images.length > 1) {
            component = (
                <Swiper
                    loop={false}
                    showsPagination={true}
                    dotColor="#FFFFFF"
                    activeDotColor="#FF3333"
                    showsButtons={false}
                    style={Style.swiper}
                    index={0}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}>
                    {images.map((image, index) => {
                        return (
                            <Image
                                key={index}
                                style={Style.image}
                                source={{uri: Common.load_image(image.name)}}
                            />
                        );
                    })}
                </Swiper>
            );
        } else if (banner) {
            component = (
                <Image
                    style={Style.image}
                    source={{uri: Common.load_image(banner)}}
                />
            );
        } else {
            // component = (
            //     <Image
            //         style={Style.image}
            //         source={require("../assets/images/empty.jpg")}
            //     />
            // );
        }

        return component;
    }

    render() {
        const {data, system} = this.props;

        const {params, trans} = system;

        const {name, price, category, description, type} = data;

        return Object.keys(data).length === 0 ? (
            <View
                style={{
                    width: itemWidth,
                    marginLeft: itemHorizontalMargin * 2,
                }}>
                <View style={Style.contentContainer}>
                    <View
                        style={{
                            ...Style.item_property,
                            backgroundColor: '#FFF',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text>Nothing!</Text>
                    </View>
                    <View style={Style.imageContainer}>
                        <View style={Style.shadow} />
                        {this.image}
                    </View>
                </View>
            </View>
        ) : (
            <View>
                <View style={Style.contentContainer}>
                    <View
                        style={{
                            ...Style.item_property,
                            backgroundColor: '#FFF',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...Style.item_property_text,
                                fontSize: 20,
                                fontWeight: '600',
                            }}>
                            {price
                                ? Common.price(
                                      price,
                                      trans[params.currency + '.symbol'],
                                  )
                                : I18n.t('common.free')}
                        </Text>
                    </View>
                    {name && (
                        <View
                            style={{
                                ...Style.item_property,
                                backgroundColor: '#FFF',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: '60%',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    numberOfLines={1}
                                    style={Style.item_property_text}>
                                    {name}
                                </Text>
                            </View>
                            {category && (
                                <View
                                    style={{
                                        width: '40%',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{fontSize: 15}}>
                                        {trans[type + '.category.' + category]}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                    {description && (
                        <ScrollView
                            alwaysBounceVertical={true}
                            style={{
                                height: this.state.contentHeight,
                                borderRadius: 5,
                                borderColor: '#DDD',
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                marginBottom: 15,
                            }}>
                            <View
                                style={{...Style.item_property, padding: 10}}
                                onLayout={event => {
                                    const {height} = event.nativeEvent.layout;
                                    this.setState({
                                        contentHeight:
                                            height > 100 ? 100 : height,
                                    });
                                }}>
                                <Text style={Style.item_property_text}>
                                    {description}
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </View>
                <View style={Style.imageContainer}>
                    <View style={Style.shadow} />
                    {this.image}
                </View>
                <ShareButton position="bottom_left" {...this.props} />
            </View>
        );
    }
}

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const Style = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    image: {
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    imageContainer: {
        alignItems: 'center',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        height: slideHeight,
        justifyContent: 'center',
        marginBottom: IS_IOS ? 0 : -1,
        width: '100%',
    },
    item_property: {
        flexWrap: 'wrap',
        padding: itemHorizontalMargin,
    },
    item_property_text: {
        color: '#333333',
    },
    shadow: {
        backgroundColor: 'rgba(250,250,250, 0.3)',
        borderRadius: entryBorderRadius,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        shadowColor: '#000',
        shadowOffset: {width: 5, height: 20},
        shadowOpacity: 0.7,
        shadowRadius: 10,
        top: 0,
    },
    swiper: {
        borderRadius: entryBorderRadius,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
    },
});

export default Secondhand;
