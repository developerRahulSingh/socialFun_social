import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
    ActivityIndicator,
    SafeAreaView,
    View,
} from 'react-native';
import {pageStyle} from "./superWorld.page.style";

const ActivityIndicatorElement = () => {
    return (
        <View style={pageStyle.activityIndicatorElementStyle}>
            <ActivityIndicator
                color={"#ffffff"}
                size={"large"}
                animating={true}
            />
        </View>
    );
}

const SuperWorldPage = () => {
    return (
        <SafeAreaView style={[pageStyle.container]}>
            <WebView
                style={{flex: 1}}
                source={{uri: 'https://city-heroku.herokuapp.com/'}}
                // source={{uri: 'https://reactnative.dev/'}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={ActivityIndicatorElement}
                startInLoadingState={true}
            />
        </SafeAreaView>
    );
};

export default SuperWorldPage;
