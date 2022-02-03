import React, {useEffect} from "react";
import {Image, Text, TextInput, View} from "react-native";
import {pageStyle} from "./signUp.page.style";
import {useWalletConnect} from "../../../WalletConnect";
import {useMoralis, useMoralisCloudFunction} from "react-moralis";
import {Button, Header} from "react-native-elements";

const SignUpPage = ({navigation}) => {
    const connector = useWalletConnect();
    const [userName, setUsername] = React.useState("");
    // const [email, setEmail] = React.useState("rahulsingh966233@gmail.com");
    const [email, setEmail] = React.useState("");
    // const [password, setPassword] = React.useState("Pass@1234");
    const [password, setPassword] = React.useState("");
    const {Moralis,} = useMoralis();
    const {fetch: callEmailCloudFunction, data, error} = useMoralisCloudFunction("sendWelcomeEmail", {
            email: email,
            name: userName,
        }, {
            autoFetch: false
        }
    );

    const signUp = async () => {
        const user = new Moralis.User();
        user.set("username", email);
        user.set("password", password);
        try {
            await user.signUp();
            await callEmailCloudFunction();
            navigation.replace("Login");
        } catch (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    }

    return (
        <View style={[pageStyle.container, {padding: 32, backgroundColor: "#ffffff"}]}>
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
                    onChangeText={setUsername}
                    value={userName}
                    placeholder="UserName"
                />
                <View style={{
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
                        fontSize: 18,
                        color: "#404040"
                    }}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                />
                <View style={{
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
                onPress={() => signUp()}
                loadingProps={{animating: true}}
                titleStyle={{fontWeight: "bold"}}
                title="Sign Up"/>
            <Text style={{
                color: "#000000",
                fontSize: 16,
                padding: 8,
            }}>
                Already have an account? <Text
                style={{color: "#8236c9", fontWeight: "bold"}}
                onPress={() => navigation.replace("Login")}> Login.</Text>
            </Text>
        </View>
    );
}

export default SignUpPage;
