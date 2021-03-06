import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    AsyncStorage,

    TouchableHighlight,
    ActivityIndicator,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Body,
    Left,
    Right,
    Item,
    Input,
    Form, Separator, Thumbnail, View, Text, Spinner
} from "native-base";


import gStyles from "../../common/globalStyles"
import common from "../../common/common"

import WebIM from '../../Lib/WebIM'
import service from "../../common/service"
import LoadingView from "../../commonComponents/LoadingView";
import StorageUtil from "../../common/Storage";
import { nisEmpty } from "../../commonComponents/CommonUtil";

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);


        this.state = {
            email: '', //504822765@qq.com
            password: '',
            loading: false,
            isSentVerify: true,
            showProgress: false,
            avatar: ''
        };

    }

    start() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'tabRoot'}),

            ]
        })
        this.props.navigation.dispatch(resetAction)

    }

    componentWillMount() {

        service.getEmail()
            .then((email) => {
                console.log(" email is " + email)

                if (email.length != 0 ) {
                    this.setState({
                        email: email
                    });
                }

            });

        service.getPassword()
            .then((password) => {

                if (password.length != 0) {

                    this.setState({
                        password: password
                    });
                }

            });

    }

    onEmailChanged(text) {
        this.setState({email: text});
    }

    onPwdChanged(text) {
        this.setState({password: text});
    }

    doLogin() {

        // this.props.navigation.reset([NavigationActions.navigate({routeName: 'App'})], 0);
        //
        // return ;


        Keyboard.dismiss()
        console.log('doLogin')

        if (this.state.loading) return;
        if (this.state.email == '') {
            common.toast("??????????????????")
            return;
        }
        // if (!common.validateEmail(this.state.email)) {
        //     common.toast("????????????????????????")
        //     return;
        // }

        if (this.state.password == '') {
            common.toast("??????????????????")
            return;
        }


        this.setState({
            loading: true,

        });

        let url = 'http://app.yubo725.top/login2';
        let formData = new FormData();
        formData.append('username', this.state.email);
        formData.append('password', this.state.password);
        this.setState({showProgress: true});
        fetch(url, {method: 'POST', body: formData})
            .then((res) => res.json())
            .then((json) => {
                console.log(json)

                    if (!nisEmpty(json)) {

                        console.log(json.code)
                        if (json.code === 1) {
                            // ?????????????????????????????????NIM????????????
                            let data = json.msg;
                            console.log(json.msg)
                            if (data != null) {
                                let userInfo = {
                                    username : this.state.email,
                                    nick : data.nick,
                                    avatar : data.avatar
                                };
                                let key = 'userInfo-' + this.state.email;
                                StorageUtil.set(key, { 'info' : userInfo });

                                this.registerHXListener();
                                this.loginToHX(this.state.email, this.state.password);
                            }
                        } else {
                            console.log(json.msg)

                        }
                    }else {
                        common.toast('????????????');
                   }

            }).catch((e) => {
            this.setState({showProgress: false});
            console.log('??????????????????: ' + e);
        });
        // service.loginSystem(this.state.email, this.state.password)
        //     .then((wrapData) => {
        //         console.log('wrapData  ')
        //         console.log(wrapData)
        //
        //         this.setState({
        //             loading: false,
        //
        //         });
        //
        //         if (wrapData.flag == "Success") {
        //             // common.toast(wrapData.msg)
        //             // DeviceEventEmitter.emit('DidLogin', true);
        //             this.start()
        //         } else {
        //             common.toast(wrapData.msg)
        //         }
        //
        //     }).then((items) => {
        //
        // }).catch((error) => {
        //     console.log(error);
        //
        //     this.setState({
        //         loading: false,
        //
        //     });
        //
        //
        // })
    }
    loginToHX(username, password) {
        // ???????????????????????????
        this.loginUsername = username;
        this.loginPassword = password;
        if (WebIM.conn.isOpened()) {
            WebIM.conn.close('logout');
        }
        // ?????????????????????????????????SplashScreen????????????listener
        WebIM.conn.open({
            apiUrl: WebIM.config.apiURL,
            user: username,
            pwd: password,
            appKey: WebIM.config.appkey
        });
    }

    registerHXListener() {
        WebIM.conn.listen({
            // xmpp????????????
            onOpened: (msg) => {
                // ???????????????????????????????????????????????????????????????????????????HomeScreen
                common.toast('????????????');
                StorageUtil.set('hasLogin', {'hasLogin': true});
                StorageUtil.set('username', {'username': this.loginUsername});
                StorageUtil.set('password', {'password': this.loginPassword});
                this.props.navigation.reset([NavigationActions.navigate({routeName: 'App'})], 0);
            },
            // ????????????
            onError: (error) => {
                common.toast('???????????????????????????');
                console.log('onError: ' + JSON.stringify(error))
            },
            // ????????????
            onClosed: (msg) => {
                // Toast.showShortCenter('??????????????????????????????');
            },
        });
    }

    render() {
        return (
            <Container style={gStyles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" style={{color: "#000"}}/>
                        </Button>
                    </Left>
                    <Body>
                    <Title style={gStyles.textAColor}>??????</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content padder>
                    <Separator style={{backgroundColor: "#FFF", height: 20}}/>

                    <View style={{flex: 1, alignItems: "center", flexWrap: "wrap", marginLeft: 40, marginRight: 40}}>
                        {/*<Thumbnail large source={cover}/>*/}

                        <Separator style={{backgroundColor: "#FFF", height: 40}}/>


                        <Item rounded>
                            <Input placeholder="???????????????" placeholderTextColor={common.colorC}
                                   onChangeText={(e) => {
                                       this.onEmailChanged(e)
                                   }}
                                   value={this.state.email}
                            />
                        </Item>

                        <Separator style={{backgroundColor: "#FFF", height: 20}}/>

                        <Item rounded>
                            <Input placeholder="???????????????" placeholderTextColor={common.colorC} secureTextEntry
                                   onChangeText={(e) => {
                                       this.onPwdChanged(e)
                                   }}
                                   value={this.state.password}
                            />
                        </Item>
                        <Separator style={{backgroundColor: "#FFF", height: 20}}/>

                        <Spinner
                            style={{position: "absolute",alignSelf: 'center'}}
                            animating={this.state.loading} size="large" color="red"/>

                        <Button block rounded style={{backgroundColor: common.colorA}} onPress={() => this.doLogin()}>
                            <Text>??????</Text>
                        </Button>
                        <Separator style={{backgroundColor: "#FFF", height: 15}}/>


                        <Text style={gStyles.textBColor}>???????????????</Text>


                        {/*<Separator style={{backgroundColor: "#FFF", height: 10}}/>*/}


                        {/*<Button block rounded style={{backgroundColor: common.colorE}}>*/}
                        {/*<Text style={{color: common.colorA}}>??????</Text>*/}
                        {/*</Button>*/}
                    </View>
                </Content>
            </Container>
        );
    }
}

