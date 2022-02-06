import {StyleSheet} from 'react-native';

const pageStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    activityIndicatorElementStyle: {
        backgroundColor: "black",
        opacity: 0.8,
        flex: 1,
        justifyContent: "center",
        position: "absolute",
        alignItems: "center",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
});

export {pageStyle};
