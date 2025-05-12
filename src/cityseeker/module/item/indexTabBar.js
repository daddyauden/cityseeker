// import React from 'react';
// import {
//     View,
//     Text,
//     Image,
//     Alert,
//     StatusBar,
//     Dimensions,
//     TouchableWithoutFeedback,
// } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {TabBar, TabView} from 'react-native-tab-view';
// import Swiper from 'react-native-swiper';
// import UUID from 'react-native-uuid';
// import {connect} from 'react-redux';
//
// import database from '../../lib/database';
//
// import {HIDE_STATUS, TRANSLUCENT_STATUS} from '../../utils/lib';
// import LoadingIndicator from '../../components/LoadingIndicator';
// import DirectionLink from '../../components/DirectionLink';
// import CommentModal from '../../components/CommentModal';
// import AlbumModal from '../../components/AlbumModal';
// import {add, remove} from '../../actions/record';
// import WebModal from '../../components/WebModal';
// import BusinessType from '../../type/business';
// import Divide from '../../components/Divide';
// import RouteConfig from '../../config/route';
// import {Common} from '../../utils/lib';
// import {info} from '../../actions/item';
// import I18n from '../../locale';
// import Style from '../../style';
//
// import FlatListAnimation from '../components/TabBarAnimation/FlatListAnimation';
// import TabBarProvider from '../components/TabBarAnimation/TabBarProvider';
// import TabBarWrap from '../components/TabBarAnimation/TabBarWrap';
// import Avator from '../components/Avator';
//
// const WIDTH = Dimensions.get('window').width;
// const TABBAR_HEIGHT = 50;
// const ALBUM_HEIGHT = 300;
// const COLUMN_HEIGHT = 60;
// const AVATOR_WITH = 60;
// const SPACE = 10;
//
// class Index extends React.Component {
//     static navigationOptions = ({navigation, screenProps}) => {
//         return {
//             headerLeft: (
//                 <View
//                     style={[
//                         Style.row,
//                         Style.p_h_3,
//                         Style.row_between,
//                         Style.column_center,
//                     ]}>
//                     <TouchableWithoutFeedback
//                         onPress={() => {
//                             navigation.goBack();
//                         }}>
//                         <FontAwesome5
//                             name="arrow-circle-left"
//                             style={[Style.f_color_3, Style.f_size_25]}
//                         />
//                     </TouchableWithoutFeedback>
//                 </View>
//             ),
//             headerTransparent: true,
//             headerStyle: {
//                 elevation: 0,
//                 borderBottomWidth: 0,
//                 backgroundColor: Style.bg_transparent.backgroundColor,
//             },
//         };
//     };
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             loading: true,
//             item: {},
//             albumModalVisible: false,
//             imageIndex: 0,
//             webModalVisible: false,
//             webUrl: '',
//             commentsReload: false,
//             commentsLatest: false,
//             comments: 0,
//             likesReload: false,
//             likesLatest: false,
//             likes: 0,
//             currentTabIndex: 0,
//             currentTabKey: '',
//             tabRoutes: [],
//             headerHeight: 0,
//         };
//     }
//
//     componentDidMount() {
//         this._requestData();
//     }
//
//     get isLiked() {
//         const {item} = this.state;
//
//         const {isLoggedIn} = this.props.account;
//
//         if (isLoggedIn) {
//             let isLiked = database
//                 .objects('record')
//                 .filtered(
//                     'type = $0 AND action = $1 AND content = $2',
//                     'item',
//                     'likes',
//                     item.id.toLowerCase(),
//                 );
//
//             return isLiked.length > 0;
//         }
//
//         return false;
//     }
//
//     _requestData = () => {
//         const {navigation} = this.props;
//         const {item} = navigation.state.params;
//
//         setTimeout(() => {
//             info({
//                 where: ["id = '" + item.id + "'", 'status = 1'],
//             }).then(response => {
//                 const {status, message} = response;
//
//                 if (parseInt(status) === 1) {
//                     let tabRoutes = [];
//                     let currentTabKey = 'item_comment';
//
//                     if (
//                         message.type === BusinessType.rental ||
//                         message.type === BusinessType.estate
//                     ) {
//                         tabRoutes.push({
//                             key: 'item_detail',
//                             title: I18n.t('app.intro.more'),
//                         });
//
//                         currentTabKey = 'item_detail';
//                     }
//                     tabRoutes.push({
//                         key: 'item_comment',
//                         title: I18n.t('common.comments'),
//                     });
//                     tabRoutes.push({
//                         key: 'item_like',
//                         title: I18n.t('common.likes'),
//                     });
//
//                     this.setState({
//                         item: message,
//                         loading: false,
//                         currentTabKey: currentTabKey,
//                         tabRoutes: tabRoutes,
//                         comments: message.comments,
//                         likes: message.likes,
//                     });
//                 } else {
//                     this.setState({
//                         loading: false,
//                     });
//                 }
//             });
//         }, 500);
//     };
//
//     _showItem = data => {
//         this.props.navigation.navigate({
//             routeName: 'item',
//             params: {
//                 item: data,
//             },
//             key: data.id,
//         });
//     };
//
//     _showBusiness = data => {
//         this.props.navigation.navigate({
//             routeName: 'LifeInfo',
//             params: {
//                 business: data,
//             },
//             key: data.id,
//         });
//     };
//
//     _hideAlbumModal = () => {
//         this.setState({
//             albumModalVisible: false,
//         });
//     };
//
//     _showAlbumModal = index => {
//         this.setState({
//             imageIndex: index,
//             albumModalVisible: true,
//         });
//     };
//
//     _showWebModal = url => {
//         this.setState({
//             webUrl: url,
//             webModalVisible: true,
//         });
//     };
//
//     _hideWebModal = () => {
//         this.setState({
//             webModalVisible: false,
//         });
//     };
//
//     _hideCommentModal = status => {
//         const {comments} = this.state;
//
//         if (status) {
//             this.setState({
//                 currentTabKey: 'comments',
//                 showCommentModal: false,
//                 commentsLatest: true,
//                 comments: comments + 1,
//             });
//         } else {
//             this.setState({
//                 currentTabKey: 'comments',
//                 showCommentModal: false,
//                 commentsLatest: false,
//             });
//         }
//     };
//
//     _showCommentModal = () => {
//         this.setState({
//             showCommentModal: true,
//         });
//     };
//
//     checkLogin = () => {
//         const {account} = this.props;
//
//         if (account.isLoggedIn === false) {
//             Common.showToast({
//                 message: (
//                     <Text style={[Style.f_size_13, Style.f_weight_500]}>
//                         {I18n.t('common.nosignin')}
//                     </Text>
//                 ),
//                 style: {
//                     ...Style.bg_color_cityseeker,
//                 },
//                 op: {
//                     onHidden: () => {
//                         Alert.alert(I18n.t('common.nosignin'), '', [
//                             {
//                                 text: I18n.t('Cancel'),
//                                 style: 'cancel',
//                             },
//                             {
//                                 text: I18n.t('common.signin'),
//                                 style: 'destructive',
//                                 onPress: () =>
//                                     this.props.navigation.navigate('Signin'),
//                             },
//                         ]);
//                     },
//                 },
//             });
//
//             return false;
//         } else {
//             return true;
//         }
//     };
//
//     recordOp = (op, record) => {
//         const {account, system} = this.props;
//         const {lat, lng, area} = system;
//
//         const {country, city} = area;
//
//         const {likes, comments} = this.state;
//
//         if (this.checkLogin(record.data) === true) {
//             if (op === 'add') {
//                 let data = {
//                     id: UUID.v4()
//                         .toUpperCase()
//                         .replace(/-/g, ''),
//                     business: account.id,
//                     lat: lat,
//                     lng: lng,
//                     country: country,
//                     city: city,
//                     type: record.type,
//                     action: record.action,
//                     content: record.data.id,
//                 };
//
//                 this.props.dispatch(add(data));
//
//                 this.setState({
//                     [record.action.toLowerCase()]:
//                         (record.action.toLowerCase() === 'likes'
//                             ? likes
//                             : comments) + 1,
//                 });
//             } else if (op === 'remove') {
//                 const data = {
//                     business: account.id,
//                     type: record.type,
//                     action: record.action,
//                     content: record.data.id,
//                 };
//
//                 this.props.dispatch(remove(data));
//                 this.setState({
//                     [record.action.toLowerCase()]:
//                         (record.action.toLowerCase() === 'likes'
//                             ? likes
//                             : comments) - 1,
//                 });
//             }
//
//             if (record.action.toLowerCase() === 'comments') {
//                 this.setState({
//                     tabNow: 0,
//                     commentsLatest: true,
//                 });
//             } else if (record.action.toLowerCase() === 'likes') {
//                 this.setState({
//                     tabNow: 2,
//                     likesReload: true,
//                 });
//             }
//         }
//     };
//
//     latestListView = listViewToken => {
//         if (listViewToken === 'comments') {
//             this.setState({
//                 commentsLatest: false,
//             });
//         } else if (listViewToken === 'likes') {
//             this.setState({
//                 likesLatest: false,
//             });
//         }
//     };
//
//     reloadListView = listViewToken => {
//         if (listViewToken === 'comments') {
//             this.setState({
//                 commentsReload: false,
//             });
//         } else if (listViewToken === 'likes') {
//             this.setState({
//                 likesReload: false,
//             });
//         }
//     };
//
//     _renderBusiness = name => {
//         const {business} = this.state.item;
//
//         let render;
//
//         if (name === 'features') {
//             const data =
//                 business.features !== undefined &&
//                 business.features.length > 0 &&
//                 business.features.map((feature, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 style={[
//                                     Style.f_size_13,
//                                     Style.f_color_2,
//                                     Style.m_l_1,
//                                 ]}>
//                                 {I18n.t('features.' + feature)}
//                             </Text>
//                         </View>
//                     );
//                 });
//
//             render = data.length > 0 && (
//                 <View style={[Style.column]}>
//                     <View
//                         style={[
//                             Style.row,
//                             Style.column_center,
//                             Style.p_v_2,
//                             Style.p_l_1,
//                             Style.m_b_2,
//                             Style.bg_color_gray,
//                         ]}>
//                         <Text
//                             style={[
//                                 Style.f_size_13,
//                                 Style.f_color_1,
//                                 Style.f_weight_400,
//                             ]}>
//                             {I18n.t('app.intro.more')}
//                         </Text>
//                     </View>
//                     <View style={[Style.row, Style.wrap]}>{data}</View>
//                 </View>
//             );
//         } else if (name === 'basic') {
//             render = (
//                 <TouchableWithoutFeedback
//                     onPress={this._showBusiness.bind(this, business)}>
//                     <View
//                         style={[
//                             Style.row,
//                             Style.row_start,
//                             Style.column_center,
//                         ]}>
//                         <View
//                             style={[
//                                 Style.row_center,
//                                 Style.column_center,
//                                 Style.overflow_hidden,
//                                 {
//                                     width: AVATOR_WITH,
//                                     height: AVATOR_WITH,
//                                     borderRadius: AVATOR_WITH / 2,
//                                 },
//                             ]}>
//                             {business.avator ? (
//                                 <Image
//                                     style={[Style.w_p100, Style.h_p100]}
//                                     resizeMode="cover"
//                                     source={{
//                                         uri: Common.load_image(business.avator),
//                                     }}
//                                 />
//                             ) : (
//                                 <Image
//                                     style={[Style.w_p100, Style.h_p100]}
//                                     source={require('../assets/images/placeholder.png')}
//                                 />
//                             )}
//                         </View>
//                         <View
//                             style={[
//                                 Style.flex,
//                                 Style.wrap,
//                                 Style.row,
//                                 Style.column_center,
//                                 Style.p_l_2,
//                             ]}>
//                             <Text
//                                 numberOfLines={2}
//                                 style={[Style.f_size_18, Style.m_r_2]}>
//                                 {business.name}
//                             </Text>
//                         </View>
//                     </View>
//                 </TouchableWithoutFeedback>
//             );
//         } else if ('avator') {
//             render = (
//                 <View
//                     style={[
//                         Style.row,
//                         Style.row_center,
//                         Style.column_center,
//                         Style.bg_color_15,
//                         {
//                             padding: 1,
//                         },
//                         Style.border_round_8,
//                         Style.b_15,
//                     ]}>
//                     <Avator user={business} size={AVATOR_WITH} />
//                 </View>
//             );
//         }
//
//         return render;
//     };
//
//     _renderItem = name => {
//         const {item} = this.state;
//
//         const {system, account} = this.props;
//
//         const {trans, params} = system;
//
//         const type = item.type.toLowerCase();
//
//         let render;
//
//         if (name === 'name') {
//             return (
//                 <View
//                     style={[
//                         Style.row,
//                         Style.column_center,
//                         Style.row_center,
//                         Style.m_t_2,
//                     ]}>
//                     <Text
//                         numberOfLines={2}
//                         style={[
//                             Style.f_fa_pf,
//                             Style.f_size_17,
//                             Style.f_color_3,
//                             Style.f_weight_500,
//                         ]}>
//                         {item.name}
//                     </Text>
//                 </View>
//             );
//         } else if (name === 'edit') {
//             const isLiked = this.isLiked;
//
//             render = (
//                 <TouchableWithoutFeedback
//                     onPress={() => {
//                         if (isLiked) {
//                             this.recordOp('remove', {
//                                 type: 'item',
//                                 action: 'likes',
//                                 data: item,
//                             });
//                         } else {
//                             this.recordOp('add', {
//                                 type: 'item',
//                                 action: 'likes',
//                                 data: item,
//                             });
//                         }
//                     }}>
//                     <View
//                         style={[
//                             Style.row,
//                             Style.column_center,
//                             Style.row_center,
//                         ]}>
//                         <View
//                             style={[
//                                 Style.row,
//                                 Style.column_center,
//                                 Style.row_center,
//                                 Style.bg_color_15,
//                                 Style.overflow_hidden,
//                                 Style.p_1,
//                                 {
//                                     width: AVATOR_WITH,
//                                     height: AVATOR_WITH,
//                                     borderRadius: AVATOR_WITH / 2,
//                                 },
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name={isLiked ? 'thumb-up' : 'thumb-up-outline'}
//                                 style={[
//                                     Style.f_size_40,
//                                     isLiked
//                                         ? Style.f_color_cityseeker
//                                         : Style.f_color_3,
//                                 ]}
//                             />
//                         </View>
//                     </View>
//                 </TouchableWithoutFeedback>
//             );
//         } else if (name === 'album') {
//             const album =
//                 item.images !== undefined && item.images.length > 0 ? (
//                     item.images.map((image, index) => {
//                         return (
//                             <TouchableWithoutFeedback
//                                 key={index}
//                                 onPress={() => this._showAlbumModal(index)}>
//                                 <Image
//                                     key={index}
//                                     style={[
//                                         Style.w_p100,
//                                         Style.h_p100,
//                                         Style.img_cover,
//                                     ]}
//                                     source={{
//                                         uri: Common.load_image(image),
//                                     }}
//                                 />
//                             </TouchableWithoutFeedback>
//                         );
//                     })
//                 ) : item.banner ? (
//                     <TouchableWithoutFeedback
//                         onPress={() => this._showAlbumModal(0)}>
//                         <Image
//                             style={[
//                                 Style.w_p100,
//                                 Style.h_p100,
//                                 Style.img_cover,
//                             ]}
//                             source={{
//                                 uri: Common.load_image(item.banner),
//                             }}
//                         />
//                     </TouchableWithoutFeedback>
//                 ) : (
//                     <Image
//                         style={[Style.w_p100, Style.h_p100, Style.img_cover]}
//                         source={require('../assets/images/placeholder.png')}
//                     />
//                 );
//
//             render = (
//                 <View
//                     style={[Style.row, Style.column_center, Style.row_center]}>
//                     <Swiper
//                         height={ALBUM_HEIGHT}
//                         index={0}
//                         loop={false}
//                         dotColor={Style.f_color_15.color}
//                         activeDotColor={Style.f_color_cityseeker.color}
//                         scrollEnabled={true}
//                         showsPagination={false}
//                         showsHorizontalScrollIndicator={false}>
//                         {album}
//                     </Swiper>
//                     <AlbumModal
//                         index={this.state.imageIndex}
//                         data={item.images || [item.banner] || []}
//                         visible={this.state.albumModalVisible}
//                         onCancel={this._hideAlbumModal}
//                     />
//                 </View>
//             );
//         } else if (name === 'meals') {
//             const data =
//                 item.meals !== undefined &&
//                 item.meals.length > 0 &&
//                 item.meals.map((meal, index) => {
//                     return (
//                         <Text
//                             key={index}
//                             style={[
//                                 Style.f_size_13,
//                                 Style.f_color_3,
//                                 Style.f_fa_pf,
//                                 Style.m_l_1,
//                             ]}>
//                             {I18n.t('restaurant.meals.' + meal)}
//                         </Text>
//                     );
//                 });
//
//             render = data.length > 0 && (
//                 <View
//                     style={[
//                         Style.row,
//                         Style.column_center,
//                         Style.bg_color_14,
//                         Style.p_l_1,
//                         Style.p_r_2,
//                         Style.p_v_2,
//                         Style.m_r_2,
//                         Style.border_round_1,
//                         Style.overflow_hidden,
//                     ]}>
//                     {data}
//                 </View>
//             );
//         } else if (name === 'parking') {
//             render =
//                 item.parking !== undefined &&
//                 item.parking.length > 0 &&
//                 item.parking.map((parking, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                                 Style.wrap,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 key={index}
//                                 style={[Style.f_size_13, Style.f_color_3]}>
//                                 {type === BusinessType.estate
//                                     ? I18n.t('estate.parking.' + parking)
//                                     : I18n.t('rental.parking.' + parking)}
//                             </Text>
//                         </View>
//                     );
//                 });
//         } else if (name === 'appliances') {
//             render =
//                 item.appliances !== undefined &&
//                 item.appliances.length > 0 &&
//                 item.appliances.map((appliance, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                                 Style.wrap,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 key={index}
//                                 style={[Style.f_size_13, Style.f_color_3]}>
//                                 {type === BusinessType.estate
//                                     ? I18n.t('estate.appliances.' + appliance)
//                                     : I18n.t('rental.appliances.' + appliance)}
//                             </Text>
//                         </View>
//                     );
//                 });
//         } else if (name === 'characteristics_in_unit') {
//             render =
//                 item.characteristics_in_unit !== undefined &&
//                 item.characteristics_in_unit.length > 0 &&
//                 item.characteristics_in_unit.map((unit, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                                 Style.wrap,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 key={index}
//                                 style={[Style.f_size_13, Style.f_color_3]}>
//                                 {I18n.t(
//                                     'rental.characteristics_in_unit.' + unit,
//                                 )}
//                             </Text>
//                         </View>
//                     );
//                 });
//         } else if (name === 'characteristics_in_building') {
//             render =
//                 item.characteristics_in_building &&
//                 item.characteristics_in_building.length > 0 &&
//                 item.characteristics_in_building.map((building, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                                 Style.wrap,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 key={index}
//                                 style={[Style.f_size_13, Style.f_color_3]}>
//                                 {I18n.t(
//                                     'rental.characteristics_in_building.' +
//                                         building,
//                                 )}
//                             </Text>
//                         </View>
//                     );
//                 });
//         } else if (name === 'inclusions') {
//             render =
//                 item.inclusions &&
//                 item.inclusions.length > 0 &&
//                 item.inclusions.map((inclusion, index) => {
//                     return (
//                         <View
//                             key={index}
//                             style={[
//                                 Style.w_p50,
//                                 Style.p_b_2,
//                                 Style.row,
//                                 Style.row_start,
//                                 Style.column_center,
//                                 Style.wrap,
//                             ]}>
//                             <MaterialCommunityIcons
//                                 name="check-circle"
//                                 style={[
//                                     Style.f_size_20,
//                                     Style.f_color_check,
//                                     Style.m_r_1,
//                                 ]}
//                             />
//                             <Text
//                                 key={index}
//                                 style={[Style.f_size_13, Style.f_color_3]}>
//                                 {I18n.t('estate.inclusions.' + inclusion)}
//                             </Text>
//                         </View>
//                     );
//                 });
//         } else if (name === 'basic') {
//             render = (
//                 <View
//                     style={{
//                         paddingHorizontal: SPACE,
//                     }}>
//                     {item.address && (
//                         <DirectionLink address={item.address} {...this.props}>
//                             <View
//                                 style={[
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.m_t_2,
//                                     Style.p_v_1,
//                                 ]}>
//                                 <FontAwesome5
//                                     name="map-marker-alt"
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_5,
//                                         Style.m_r_1,
//                                     ]}
//                                 />
//                                 <Text
//                                     style={[
//                                         Style.flex,
//                                         Style.f_size_12,
//                                         Style.f_color_5,
//                                     ]}>
//                                     {item.address}
//                                     {', '}
//                                     {Common.capitalize(item.city)} {item.zip}
//                                     {'  '}
//                                     <FontAwesome5
//                                         name="external-link-square-alt"
//                                         style={[
//                                             Style.f_size_13,
//                                             Style.f_color_facebook,
//                                         ]}
//                                     />
//                                 </Text>
//                             </View>
//                         </DirectionLink>
//                     )}
//                     <View style={[Style.row, Style.column_center, Style.m_t_2]}>
//                         {item.cuisine && (
//                             <Text
//                                 style={[
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.bg_color_14,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.border_round_1,
//                                     Style.overflow_hidden,
//                                 ]}>
//                                 {I18n.t('cuisine.' + item.cuisine)}
//                             </Text>
//                         )}
//                         {this._renderItem('meals')}
//                         {type === BusinessType.household && item.category && (
//                             <Text
//                                 style={[
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.bg_color_14,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.border_round_1,
//                                     Style.overflow_hidden,
//                                 ]}>
//                                 {I18n.t('household.category.' + item.category)}
//                             </Text>
//                         )}
//                         {type === BusinessType.spa && item.duration != 0 && (
//                             <Text
//                                 style={[
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.bg_color_14,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.border_round_1,
//                                     Style.overflow_hidden,
//                                 ]}>
//                                 {item.duration} {I18n.t('common.time.minute')}
//                             </Text>
//                         )}
//                         {type === BusinessType.training &&
//                             item.duration != 0 &&
//                             item.begin_date !== undefined && (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.bg_color_14,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.border_round_1,
//                                         Style.overflow_hidden,
//                                     ]}>
//                                     {I18n.t('training.begin_date')}
//                                     {': '}
//                                     {Common.datetime(
//                                         item.begin_date,
//                                         params['date_format'],
//                                     )}
//                                 </Text>
//                             )}
//                         {type === BusinessType.training &&
//                             item.duration != 0 &&
//                             item.begin_date !== undefined && (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.bg_color_14,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.border_round_1,
//                                         Style.overflow_hidden,
//                                     ]}>
//                                     {I18n.t('training.duration')}
//                                     {': '}
//                                     {item.duration}
//                                 </Text>
//                             )}
//                         {(type === BusinessType.rental ||
//                             type === BusinessType.estate) &&
//                             item.property_type && (
//                                 <View
//                                     style={[
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.bg_color_14,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.border_round_1,
//                                         Style.overflow_hidden,
//                                     ]}>
//                                     <Text
//                                         style={[
//                                             Style.f_size_13,
//                                             Style.f_color_3,
//                                             Style.f_weight_400,
//                                             Style.m_r_2,
//                                         ]}>
//                                         {I18n.t(
//                                             type +
//                                                 '.property_type.' +
//                                                 item.property_type,
//                                         )}
//                                     </Text>
//                                     <FontAwesome5
//                                         name="bed"
//                                         style={[
//                                             Style.f_size_15,
//                                             Style.f_color_5,
//                                             Style.m_r_1,
//                                         ]}
//                                     />
//                                     <Text
//                                         style={[
//                                             Style.f_size_13,
//                                             Style.f_color_cityseeker,
//                                             Style.f_weight_400,
//                                             Style.m_r_2,
//                                         ]}>
//                                         {item.bedrooms}
//                                     </Text>
//                                     <FontAwesome5
//                                         name="shower"
//                                         style={[
//                                             Style.f_size_15,
//                                             Style.f_color_5,
//                                             Style.m_r_1,
//                                         ]}
//                                     />
//                                     <Text
//                                         style={[
//                                             Style.f_size_13,
//                                             Style.f_color_cityseeker,
//                                             Style.f_weight_400,
//                                         ]}>
//                                         {item.bathrooms}
//                                     </Text>
//                                 </View>
//                             )}
//                         {type === BusinessType.training && item.category && (
//                             <View
//                                 style={[
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.bg_color_14,
//                                     Style.p_1,
//                                     Style.m_r_2,
//                                     Style.border_round_1,
//                                     Style.overflow_hidden,
//                                 ]}>
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                     ]}>
//                                     {I18n.t(
//                                         'training.category.' + item.category,
//                                     )}
//                                     {item.sub_category &&
//                                         ' / ' +
//                                             I18n.t(
//                                                 'training.sub_category.' +
//                                                     item.category +
//                                                     '.' +
//                                                     item.sub_category,
//                                             )}
//                                 </Text>
//                             </View>
//                         )}
//                         {type === BusinessType.autotrade && (
//                             <View
//                                 style={[
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.bg_color_14,
//                                     Style.p_1,
//                                     Style.m_r_2,
//                                     Style.border_round_1,
//                                     Style.overflow_hidden,
//                                 ]}>
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.m_r_2,
//                                     ]}>
//                                     {I18n.t(
//                                         'autotrade.body_type.' + item.body_type,
//                                     )}
//                                 </Text>
//                                 <MaterialCommunityIcons
//                                     name="seat-recline-extra"
//                                     style={[
//                                         Style.f_size_15,
//                                         Style.f_color_5,
//                                         Style.m_r_1,
//                                     ]}
//                                 />
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_cityseeker,
//                                         Style.f_weight_400,
//                                         Style.m_r_2,
//                                     ]}>
//                                     {item.seating}
//                                 </Text>
//                                 <MaterialCommunityIcons
//                                     name="car-door"
//                                     style={[
//                                         Style.f_size_15,
//                                         Style.f_color_5,
//                                         Style.m_r_1,
//                                     ]}
//                                 />
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_cityseeker,
//                                         Style.f_weight_400,
//                                     ]}>
//                                     {item.doors}
//                                 </Text>
//                             </View>
//                         )}
//                         <View
//                             style={[
//                                 Style.row,
//                                 Style.column_center,
//                                 Style.bg_color_14,
//                                 Style.p_1,
//                                 Style.m_r_2,
//                                 Style.border_round_1,
//                                 Style.overflow_hidden,
//                             ]}>
//                             {(type === BusinessType.bakery ||
//                                 type === BusinessType.bar ||
//                                 type === BusinessType.coffee ||
//                                 type === BusinessType.restaurant) && (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                     ]}>
//                                     {I18n.t('common.avarage')}
//                                 </Text>
//                             )}
//                             {item.avarage !== undefined ? (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}>
//                                     {I18n.t('common.avarage.' + item.avarage)}
//                                 </Text>
//                             ) : item.price ? (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}>
//                                     {Common.price(
//                                         item.price,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             ) : item.total_price !== undefined ? (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}>
//                                     {Common.price(
//                                         item.total_price,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             ) : item.payment_price !== undefined ? (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}>
//                                     {Common.price(
//                                         item.payment_price,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             ) : (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}
//                                 />
//                             )}
//                             {type === BusinessType.rental && (
//                                 <Text
//                                     style={[
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_fa_pf,
//                                         Style.f_weight_500,
//                                         Style.m_l_1,
//                                     ]}>
//                                     {I18n.t(
//                                         'rental.payment_frequency.' +
//                                             item.payment_frequency,
//                                     )}
//                                 </Text>
//                             )}
//                             {type === 'autotrade' &&
//                                 item.condition === 'transfer' &&
//                                 item.payment_frequency && (
//                                     <Text
//                                         style={[
//                                             Style.f_size_13,
//                                             Style.f_color_3,
//                                             Style.f_fa_pf,
//                                             Style.f_weight_500,
//                                             Style.m_l_1,
//                                         ]}>
//                                         {I18n.t(
//                                             'autotrade.payment_frequency.' +
//                                                 item.payment_frequency,
//                                         )}
//                                     </Text>
//                                 )}
//                         </View>
//                     </View>
//                     <View style={[Style.row, Style.wrap, Style.m_t_2]}>
//                         {item.make && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {I18n.t('autotrade.make.' + item.make)}
//                                 </Text>
//                                 <Text>{item.model}</Text>
//                             </View>
//                         )}
//                         {item.condition !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {Common.datetime(item.year, 'YYYY')}
//                                 </Text>
//                                 <Text>
//                                     {I18n.t(
//                                         'autotrade.condition.' + item.condition,
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.condition !== 'new' &&
//                             item.mileage !== undefined && (
//                                 <View
//                                     style={[
//                                         Style.column,
//                                         Style.column_center,
//                                         Style.row_evenly,
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.b,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.m_b_2,
//                                         {
//                                             height: COLUMN_HEIGHT,
//                                         },
//                                     ]}>
//                                     <Text>{Common.mileage(item.mileage)}</Text>
//                                     <Text>
//                                         {I18n.t('app.unit.' + params.mileage)}
//                                     </Text>
//                                 </View>
//                             )}
//                         {item.transmission && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {I18n.t(
//                                         'autotrade.transmission.' +
//                                             item.transmission,
//                                     )}
//                                 </Text>
//                                 <Text>{I18n.t('autotrade.transmission')}</Text>
//                             </View>
//                         )}
//                         {item.engine !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {I18n.t('autotrade.engine.' + item.engine)}
//                                 </Text>
//                                 <Text>{I18n.t('autotrade.engine')}</Text>
//                             </View>
//                         )}
//                         {item.drivetrain && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {I18n.t(
//                                         'autotrade.drivetrain.' +
//                                             item.drivetrain,
//                                     )}
//                                 </Text>
//                                 <Text>{I18n.t('autotrade.drivetrain')}</Text>
//                             </View>
//                         )}
//                         {item.fuel_type && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('autotrade.fuel_type')}</Text>
//                                 <Text>
//                                     {I18n.t(
//                                         'autotrade.fuel_type.' + item.fuel_type,
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {type === BusinessType.rental &&
//                             item.date_available !== undefined && (
//                                 <View
//                                     style={[
//                                         Style.column,
//                                         Style.column_center,
//                                         Style.row_evenly,
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.b,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.m_b_2,
//                                         {
//                                             height: COLUMN_HEIGHT,
//                                         },
//                                     ]}>
//                                     <Text>
//                                         {Common.datetime(
//                                             item.date_available,
//                                             params.date_format,
//                                         )}
//                                     </Text>
//                                     <Text>{I18n.t('app.intro.from')}</Text>
//                                 </View>
//                             )}
//                         {type === BusinessType.rental &&
//                             item.payment_frequency && (
//                                 <View
//                                     style={[
//                                         Style.column,
//                                         Style.column_center,
//                                         Style.row_evenly,
//                                         Style.f_size_13,
//                                         Style.f_color_3,
//                                         Style.f_weight_400,
//                                         Style.b,
//                                         Style.p_2,
//                                         Style.m_r_2,
//                                         Style.m_b_2,
//                                         {
//                                             height: COLUMN_HEIGHT,
//                                         },
//                                     ]}>
//                                     <Text>
//                                         {I18n.t('rental.payment_frequency')}
//                                     </Text>
//                                     <Text>
//                                         {I18n.t(
//                                             'rental.payment_frequency.' +
//                                                 item.payment_frequency,
//                                         )}
//                                     </Text>
//                                 </View>
//                             )}
//                         {type === BusinessType.rental && item.lease_term && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('rental.lease_term')}</Text>
//                                 <Text>
//                                     {I18n.t(
//                                         'rental.lease_term.' + item.lease_term,
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.storey && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('rental.storey')}</Text>
//                                 <Text>{item.storey}</Text>
//                             </View>
//                         )}
//                         {item.build_in !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {type === BusinessType.estate
//                                         ? I18n.t('estate.build_in')
//                                         : I18n.t('rental.build_in')}
//                                 </Text>
//                                 <Text>
//                                     {Common.datetime(item.build_in, 'YYYY')}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.floor_size !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {type === BusinessType.estate
//                                         ? I18n.t('estate.floor_size')
//                                         : I18n.t('rental.floor_size')}
//                                 </Text>
//                                 <Text>
//                                     {item.floor_size}
//                                     {I18n.t(
//                                         'app.unit.' + params.real_estate_unit,
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.lot_size !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('estate.lot_size')}</Text>
//                                 <Text>
//                                     {item.lot_size}
//                                     {I18n.t(
//                                         'app.unit.' + params.real_estate_unit,
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.building_assessment !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>
//                                     {I18n.t('estate.building_assessment')}
//                                 </Text>
//                                 <Text>
//                                     {Common.price(
//                                         item.building_assessment,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.lot_assessment !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('estate.lot_assessment')}</Text>
//                                 <Text>
//                                     {Common.price(
//                                         item.lot_assessment,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.municipal_tax !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('estate.municipal_tax')}</Text>
//                                 <Text>
//                                     {Common.price(
//                                         item.municipal_tax,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.school_tax !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('estate.school_tax')}</Text>
//                                 <Text>
//                                     {Common.price(
//                                         item.school_tax,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                         {item.monthly_fees !== undefined && (
//                             <View
//                                 style={[
//                                     Style.column,
//                                     Style.column_center,
//                                     Style.row_evenly,
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     Style.b,
//                                     Style.p_2,
//                                     Style.m_r_2,
//                                     Style.m_b_2,
//                                     {
//                                         height: COLUMN_HEIGHT,
//                                     },
//                                 ]}>
//                                 <Text>{I18n.t('estate.monthly_fees')}</Text>
//                                 <Text>
//                                     {Common.price(
//                                         item.monthly_fees,
//                                         I18n.t(params.currency),
//                                     )}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                     {item.parking !== undefined && item.parking.length > 0 && (
//                         <View style={[Style.m_t_2, Style.b_b]}>
//                             <View
//                                 style={[
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.p_b_2,
//                                 ]}>
//                                 <FontAwesome5
//                                     style={[Style.m_r_1, Style.f_size_15]}
//                                     name="parking"
//                                 />
//                                 <Text>
//                                     {type === BusinessType.estate
//                                         ? I18n.t('estate.parking')
//                                         : I18n.t('rental.parking')}
//                                 </Text>
//                             </View>
//                             <View style={[Style.row, Style.wrap]}>
//                                 {this._renderItem('parking')}
//                             </View>
//                         </View>
//                     )}
//                     {item.inclusions !== undefined &&
//                         item.inclusions.length > 0 && (
//                             <View style={[Style.m_t_2, Style.b_b]}>
//                                 <View
//                                     style={[
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.p_b_2,
//                                     ]}>
//                                     <FontAwesome5
//                                         style={[Style.m_r_1, Style.f_size_15]}
//                                         name="building"
//                                     />
//                                     <Text>{I18n.t('estate.inclusions')}</Text>
//                                 </View>
//                                 <View style={[Style.row, Style.wrap]}>
//                                     {this._renderItem('inclusions')}
//                                 </View>
//                             </View>
//                         )}
//                     {item.appliances !== undefined &&
//                         item.appliances.length > 0 && (
//                             <View style={[Style.m_t_2, Style.b_b]}>
//                                 <View
//                                     style={[
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.p_b_2,
//                                     ]}>
//                                     <MaterialCommunityIcons
//                                         style={[Style.m_r_1, Style.f_size_20]}
//                                         name="television"
//                                     />
//                                     <Text>
//                                         {type === BusinessType.estate
//                                             ? I18n.t('estate.appliances')
//                                             : I18n.t('rental.appliances')}
//                                     </Text>
//                                 </View>
//                                 <View style={[Style.row, Style.wrap]}>
//                                     {this._renderItem('appliances')}
//                                 </View>
//                             </View>
//                         )}
//                     {item.characteristics_in_unit &&
//                         item.characteristics_in_unit.length > 0 && (
//                             <View style={[Style.m_t_2, Style.b_b]}>
//                                 <View
//                                     style={[
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.p_b_2,
//                                     ]}>
//                                     <FontAwesome5
//                                         style={[Style.m_r_1, Style.f_size_16]}
//                                         name="building"
//                                     />
//                                     <Text>
//                                         {I18n.t(
//                                             'rental.characteristics_in_unit',
//                                         )}
//                                     </Text>
//                                 </View>
//                                 <View style={[Style.row, Style.wrap]}>
//                                     {this._renderItem(
//                                         'characteristics_in_unit',
//                                     )}
//                                 </View>
//                             </View>
//                         )}
//                     {item.characteristics_in_building &&
//                         item.characteristics_in_building.length > 0 && (
//                             <View style={[Style.m_t_2, Style.b_b]}>
//                                 <View
//                                     style={[
//                                         Style.row,
//                                         Style.column_center,
//                                         Style.p_b_2,
//                                     ]}>
//                                     <FontAwesome5
//                                         style={[Style.m_r_1, Style.f_size_16]}
//                                         name="building"
//                                     />
//                                     <Text>
//                                         {I18n.t(
//                                             'rental.characteristics_in_building',
//                                         )}
//                                     </Text>
//                                 </View>
//                                 <View style={[Style.row, Style.wrap]}>
//                                     {this._renderItem(
//                                         'characteristics_in_building',
//                                     )}
//                                 </View>
//                             </View>
//                         )}
//                     {item.proximity !== undefined && (
//                         <View style={[Style.m_t_2, Style.b_b, Style.p_v_2]}>
//                             <View
//                                 style={[
//                                     Style.row,
//                                     Style.column_center,
//                                     Style.p_b_2,
//                                 ]}>
//                                 <MaterialCommunityIcons
//                                     style={[Style.m_r_1, Style.f_size_20]}
//                                     name="access-point"
//                                 />
//                                 <Text>{I18n.t('estate.proximity')}</Text>
//                             </View>
//                             <View style={[Style.row, Style.column_center]}>
//                                 <Text
//                                     style={[Style.f_color_3, Style.f_size_13]}>
//                                     {item.proximity}
//                                 </Text>
//                             </View>
//                         </View>
//                     )}
//                     {item.description !== undefined && (
//                         <View style={[Style.p_v_2]}>
//                             <Text
//                                 style={[
//                                     Style.f_size_13,
//                                     Style.f_color_3,
//                                     Style.f_weight_400,
//                                     {
//                                         lineHeight: 17,
//                                     },
//                                 ]}>
//                                 {item.description}
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             );
//         }
//
//         return render;
//     };
//
//     _renderScene = ({route}) => {
//         const {headerHeight} = this.state;
//         const {item} = this.state;
//
//         const {system} = this.props;
//
//         let item_detail;
//
//         if (
//             item.type === BusinessType.rental ||
//             item.type === BusinessType.estate
//         ) {
//             item_detail = (
//                 <View style={[Style.flex, Style.theme_content]}>
//                     <FlatListAnimation
//                         {...this.props}
//                         contentContainerStyle={{
//                             paddingTop: headerHeight + TABBAR_HEIGHT,
//                         }}
//                         tabRoute="item_detail"
//                         data={[item]}
//                         renderItem={({item}) => {
//                             return <View>{this._renderItem('basic')}</View>;
//                         }}
//                     />
//                 </View>
//             );
//         }
//
//         const item_comment = (
//             <FlatListAnimation
//                 {...this.props}
//                 contentContainerStyle={{
//                     paddingTop: headerHeight + TABBAR_HEIGHT,
//                 }}
//                 tabRoute="item_comment"
//                 cellType="comment"
//                 requestHost={RouteConfig.comment.list}
//                 select={[
//                     'id',
//                     'business',
//                     'type',
//                     'title',
//                     'images',
//                     'add_time',
//                 ]}
//                 where={["content ='" + item.id + "'", "type = 'item'"]}
//                 order={['add_time DESC nulls last']}
//                 renderSeparator={() => {
//                     return <Divide />;
//                 }}
//                 renderHeader={() => {
//                     return (
//                         <TouchableWithoutFeedback
//                             onPress={this._showCommentModal}>
//                             <View
//                                 style={[
//                                     Style.p_v_2,
//                                     Style.p_h_3,
//                                     Style.theme_header,
//                                 ]}>
//                                 <View
//                                     style={[
//                                         Style.column,
//                                         Style.border_round_2,
//                                         Style.bg_color_15,
//                                         Style.p_v_2,
//                                         Style.p_h_3,
//                                     ]}>
//                                     <Text
//                                         style={[
//                                             Style.f_size_11,
//                                             Style.f_color_6,
//                                             Style.f_fa_pf,
//                                             Style.f_weight_500,
//                                         ]}>
//                                         {I18n.t('common.post') +
//                                             ' ' +
//                                             I18n.t('common.comments')}
//                                     </Text>
//                                 </View>
//                                 <CommentModal
//                                     system={this.props.system}
//                                     account={this.props.account}
//                                     data={item}
//                                     commentType="item"
//                                     pickerType="album"
//                                     mediaType="photo"
//                                     visible={this.state.showCommentModal}
//                                     onDismiss={this._hideCommentModal}
//                                 />
//                             </View>
//                         </TouchableWithoutFeedback>
//                     );
//                 }}
//                 stickyHeaderIndices={[0]}
//                 latestListView={
//                     this.state.commentsLatest ? this.latestListView : null
//                 }
//                 listViewToken="comments"
//             />
//         );
//
//         const item_like = (
//             <FlatListAnimation
//                 {...this.props}
//                 contentContainerStyle={{
//                     paddingTop: headerHeight + TABBAR_HEIGHT,
//                 }}
//                 tabRoute="item_like"
//                 cellType="like"
//                 requestHost={RouteConfig.record.list}
//                 select={['id', 'business', 'content', 'type', 'add_time']}
//                 where={[
//                     "content ='" + item.id + "'",
//                     "action = 'likes'",
//                     "type = 'item'",
//                 ]}
//                 order={['add_time DESC nulls last']}
//                 renderSeparator={() => {
//                     return <Divide />;
//                 }}
//                 renderEmptyList={() => {
//                     return null;
//                 }}
//                 reloadListView={
//                     this.state.likesReload ? this.reloadListView : null
//                 }
//                 listViewToken="likes"
//             />
//         );
//
//         switch (route.key) {
//             case 'item_detail':
//                 return item_detail;
//             case 'item_comment':
//                 return (
//                     <View style={[Style.flex, Style.theme_content]}>
//                         {item_comment}
//                     </View>
//                 );
//             case 'item_like':
//                 return (
//                     <View style={[Style.flex, Style.theme_content]}>
//                         {item_like}
//                     </View>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     _renderHeader = () => {
//         const {headerHeight, item} = this.state;
//         return (
//             <View
//                 onLayout={event => {
//                     const {height} = event.nativeEvent.layout;
//
//                     if (headerHeight === height) {
//                         return;
//                     }
//
//                     this.setState({
//                         headerHeight: height,
//                     });
//                 }}
//                 style={[Style.theme_content]}>
//                 {this._renderItem('album')}
//                 <View
//                     style={[
//                         Style.column,
//                         Style.p_h_2,
//                         Style.p_b_2,
//                         {
//                             marginTop: -AVATOR_WITH / 2,
//                         },
//                     ]}>
//                     <View
//                         style={[Style.row, Style.column_end, Style.row_center]}>
//                         {/*{this._renderBusiness("avator")}*/}
//                         {this._renderItem('edit')}
//                     </View>
//                     {this._renderItem('name')}
//                     {item.type !== BusinessType.rental &&
//                         item.type !== BusinessType.estate &&
//                         this._renderItem('basic')}
//                 </View>
//                 {/*<Divide*/}
//                 {/*    style={{*/}
//                 {/*        ...Style.p_b_2,*/}
//                 {/*        ...Style.h_0,*/}
//                 {/*        ...Style.bg_color_14*/}
//                 {/*    }}*/}
//                 {/*/>*/}
//             </View>
//         );
//     };
//
//     _renderLabel = ({route, focused}) => {
//         const {tabRoutes} = this.state;
//
//         const containerStyle = {
//             ...Style.row,
//             ...Style.column_center,
//             ...Style.row_center,
//             width: WIDTH / tabRoutes.length,
//         };
//
//         const textStyle = {
//             ...Style.f_size_13,
//             ...Style.f_weight_500,
//             ...Style.f_fa_pf,
//             color:
//                 focused === true
//                     ? Style.f_color_3.color
//                     : Style.f_color_9.color,
//         };
//
//         const {comments, likes} = this.state;
//
//         let badge = null;
//
//         if (
//             route.key === 'item_comment' &&
//             comments !== undefined &&
//             comments
//         ) {
//             badge = Common.customNumber(comments);
//         } else if (route.key === 'item_like' && likes !== undefined && likes) {
//             badge = Common.customNumber(likes);
//         }
//
//         return (
//             <View style={containerStyle}>
//                 <Text style={textStyle}>
//                     {route.title} {badge}
//                 </Text>
//             </View>
//         );
//     };
//
//     _renderTabBar = (animation, canJumpToTab) => props => (
//         <TabBarWrap
//             animation={animation}
//             renderTabBar={() => (
//                 <TabBar
//                     onTabPress={({route}) => {
//                         if (
//                             route.key != this.state.currentTabKey &&
//                             canJumpToTab
//                         ) {
//                             animation.onTabPress(route);
//                         }
//                     }}
//                     renderLabel={this._renderLabel}
//                     indicatorStyle={[
//                         Style.bg_color_cityseeker,
//                         Style.h_3,
//                         {marginBottom: 5},
//                     ]}
//                     style={[
//                         Style.p_v_0,
//                         Style.b_b,
//                         Style.theme_content,
//                         {height: TABBAR_HEIGHT},
//                     ]}
//                     {...props}
//                 />
//             )}
//             renderHeader={this._renderHeader}
//         />
//     );
//
//     render() {
//         const {
//             webUrl,
//             webModalVisible,
//             loading,
//             currentTabIndex,
//             currentTabKey,
//             tabRoutes,
//             headerHeight,
//         } = this.state;
//
//         return loading === true ? (
//             <View style={[Style.flex, Style.row_center, Style.column_center]}>
//                 <LoadingIndicator />
//             </View>
//         ) : (
//             <TabBarProvider
//                 currentTabKey={currentTabKey}
//                 topPartHeight={headerHeight}>
//                 {(animation, {canJumpToTab}) => (
//                     <View
//                         style={{
//                             width: Style.w_100.width,
//                             height: Style.h_fill.height,
//                         }}>
//                         <StatusBar
//                             hidden={!HIDE_STATUS}
//                             barStyle="dark-content"
//                             translucent={!TRANSLUCENT_STATUS}
//                         />
//                         <TabView
//                             navigationState={{
//                                 index: currentTabIndex,
//                                 currentTabKey: currentTabKey,
//                                 routes: tabRoutes,
//                             }}
//                             renderTabBar={this._renderTabBar(
//                                 animation,
//                                 canJumpToTab,
//                             )}
//                             renderScene={this._renderScene}
//                             initialLayout={{
//                                 width: Style.w_100.width,
//                                 height: Style.h_fill.height,
//                             }}
//                             onIndexChange={currentTabIndex => {
//                                 this.setState({
//                                     currentTabKey:
//                                         tabRoutes[currentTabIndex].key,
//                                     currentTabIndex,
//                                 });
//                             }}
//                             swipeEnabled={true}
//                             canJumpToTab={() => canJumpToTab}
//                             useNativeDriver
//                             lazy={false}
//                         />
//                         <WebModal
//                             url={webUrl}
//                             visible={webModalVisible}
//                             onDismiss={this._hideWebModal}
//                         />
//                     </View>
//                 )}
//             </TabBarProvider>
//         );
//     }
// }
//
// function mapStateToProps(state) {
//     return {
//         account: state.account,
//         system: state.system,
//     };
// }
//
// export default connect(mapStateToProps)(Index);
