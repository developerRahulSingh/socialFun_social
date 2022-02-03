import React from "react";
import {Text, TextInput, View, Image} from "react-native";
import {pageStyle} from "./login.page.style";
import {useWalletConnect} from "../../../WalletConnect";
import {useMoralis} from "react-moralis";
import {Button} from "react-native-elements";

const LoginPage = ({navigation}) => {
    const connector = useWalletConnect();
    // const [email, setEmail] = React.useState("");
    const [email, setEmail] = React.useState("Test@test3.com");
    // const [password, setPassword] = React.useState("");
    const [password, setPassword] = React.useState("Pass@1234");
    const {
        authenticate,
        authError,
        isAuthenticated,
        Moralis,
        user,
    } = useMoralis();

    const signUp = async () => {
        navigation.push("SignUp")
    }

    const login = async () => {
        try {
            const user = await Moralis.User.logIn(email, password);
            if (user) {
                navigation.replace("BottomTabNavigation");
            }
        } catch (error) {
            // Show the error message somewhere and let the user try again.
            console.log("Error: " + error.code + " " + error.message);
        }
    }

    const handleCryptoLogin = () => {
        authenticate({connector})
            .then(() => {
                if (isAuthenticated) {
                    console.log("user login Success ==>> ", user);
                    console.log("Auth isAuthenticated ==>> ", isAuthenticated);
                    navigation.replace("BottomTabNavigation");
                } else if (authError) {
                    console.log("Auth error ==>> ", authError);
                } else {
                    console.log("user login fail ==>> ", user);
                }
            })
            .catch((e) => {
                console.log("e =>> ", e);
            });
    };

    return (
        <View style={[
            pageStyle.container,
            {
                padding: 32,
                backgroundColor: "#ffffff",
            }]}>
            <Image source={require("../../../assets/images/logo-night-mode.png")} style={{height: 400, width: "100%"}}/>
            <View style={{
                width: "100%",
                backgroundColor: "#f2f2f2",
                margin: 8,
                borderRadius: 8,
                overflow: "hidden"
            }}>
                <TextInput
                    style={{
                        height: 56,
                        padding: 8,
                        width: "100%",
                        fontSize: 18,
                        color: "#404040"
                    }}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                />
                <View style={{
                    // marginHorizontal:8,
                    backgroundColor: "#8236c9",
                    height: 4,
                }}
                />
            </View>
            <View style={{
                width: "100%",
                backgroundColor: "#f2f2f2",
                margin: 8,
                borderRadius: 8,
                overflow: "hidden"
            }}>
                <TextInput
                    style={{
                        height: 56,
                        padding: 8,
                        width: "100%",
                        borderRadius: 8,
                        fontSize: 18,
                        color: "#404040"
                    }}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <View style={{
                    backgroundColor: "#8236c9",
                    height: 4,
                }}
                />
            </View>
            <Button
                buttonStyle={{
                    width: "100%",
                    height: 44,
                    borderRadius: 32,
                    backgroundColor: "#8236c9",
                }}
                containerStyle={{
                    width: "100%",
                    margin: 8,
                    paddingTop: 16,
                }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: "#00F",
                }}
                onPress={() => login()}
                loadingProps={{animating: true}}
                titleStyle={{fontWeight: "bold"}}
                title="Login"/>
            <Button
                buttonStyle={{
                    width: "100%",
                    height: 44,
                    borderRadius: 32,
                    backgroundColor: "#8236c9",
                }}
                containerStyle={{
                    width: "100%",
                    margin: 8,
                }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: "#00F",
                }}
                onPress={handleCryptoLogin}
                // onPress={() =>  authenticate({connector})}
                loadingProps={{animating: true}}
                titleStyle={{fontWeight: "bold"}}
                title="Login with Web3"/>

            <Text style={{
                color: "#000000",
                fontSize: 16,
                padding: 8,
            }}>
                Don't have an account? <Text
                style={{color: "#8236c9", fontWeight: "bold"}}
                onPress={() => signUp()}>Sign Up.</Text>
            </Text>
        </View>
    );
}

export default LoginPage;
