import React, {useState, useEffect} from "react";
import {ActivityIndicator, View, StyleSheet, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SplashScreen = ({navigation}) => {
    //State for ActivityIndicator animation
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            navigation.replace("Login");
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/logo.png")}
                style={{height: 400, width: "100%"}}/>
            <ActivityIndicator
                animating={animating}
                color="#FFFFFF"
                size="large"
                style={styles.activityIndicator}
            />

        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#612897",
        // backgroundColor: "#ffffff",
    },
    activityIndicator: {
        alignItems: "center",
        height: 80,
    },
});
