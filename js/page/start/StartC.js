import React, {Component} from "react";

import {
    Container,

    Content,
    Button,

    Text,

} from "native-base";


import styles from "./styles";

import StartContentView from "./StartContentView"
import StartHeader from "./StartHeader";

import JumpButton from "../../commonComponents/JumpButton";
import Color from "../../commonComponents/Color";
import PushButton from "../../commonComponents/PushButton";

import {StackActions, NavigationActions} from 'react-navigation';


export default class StartC extends Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.keyWord = '';
    }

    start() {


        this.props.navigation.reset([NavigationActions.navigate({routeName: 'App'})], 0);

    }


    render() {
        return (

            <Container style={[styles.container]}>

                <Content padder>
                    <StartHeader titltA='GiftExchange' titltB='讓你輕鬆認識新朋友！'/>
                    <StartContentView titleA='Step 4:約定時間地點進行禮物交換' placeholder={'文字描述......'} value={this.keyWord}
                                      onChangeText={(text) => this.keyWord = text}/>

                     <PushButton onClick={() => this.props.navigation.push('StartD')}/>
                </Content>
                <JumpButton btnTitle='跳转' onClick={this.start.bind(this)}/>
            </Container>
        );
    }


}
