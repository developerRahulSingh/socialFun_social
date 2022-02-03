import {StyleSheet} from 'react-native';

const pageStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    flatListContainer: {
        width: "100%",
        padding: 8,
        borderRadius: 8,
    },
    colorTextStyle: {
        color: "#404040"
    },
    flatLisRenderItemStyle: {
        flex: 1,
        height: 560,
        backgroundColor: "#ffffff",
        width: "100%",
        padding: 8,
        textAlign: "left",
    },
    flatListRenderItemTextStyle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#8236c9",
        padding: 4,
    },
    button: {
        borderRadius: 4,
        padding: 16,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#8236c9",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});

export {pageStyle};
