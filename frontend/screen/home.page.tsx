import React from "react";
import {StyleSheet, Text, View, TextInput} from "react-native";
import {
    useMoralis,
    useMoralisWeb3Api,
    useMoralisWeb3ApiCall,
} from "react-moralis";
import {useWalletConnect} from "../WalletConnect";
import {Button, Header, Icon} from "react-native-elements";

const styles = StyleSheet.create({
    center: {alignItems: "center", justifyContent: "center", flex: 1},
    topCenter: {alignItems: "center"},

    white: {backgroundColor: "white"},
    margin: {marginBottom: 20},
    marginLarge: {marginBottom: 35},
    weightHeavey: {fontWeight: "700", fontSize: 20},
});

function Web3ApiExample(): JSX.Element {
    const {Moralis, user} = useMoralis();

    const chainNAme = "eth";
    const {
        account: {getNativeBalance},
    } = useMoralisWeb3Api();

    //defaults to eth chain and user logged in address, if you want custom, you can pass in the options argument
    const {data, isFetching, error} = useMoralisWeb3ApiCall(getNativeBalance);

    if (isFetching) {
        return (
            <View style={styles.marginLarge}>
                <Text>Fetching token-balances...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.marginLarge}>
                <Text>Error:</Text>
                <Text>{JSON.stringify(error)}</Text>
            </View>
        );
    }

    return (
        <View style={styles.marginLarge}>
            <Text style={styles.weightHeavey}>Native balance</Text>

            <Text style={styles.weightHeavey}>
                {/* @ts-ignore */}
                {data ? data.balance / ("1e" + "18") : "none"}
            </Text>
        </View>
    );
}

function UserExample(): JSX.Element {
    const {user} = useMoralis();

    return (
        <View style={styles.marginLarge}>
            <Text style={styles.weightHeavey}>UserName: {user.getUsername()}</Text>
            <Text style={styles.weightHeavey}>
                User Email: {user.getEmail() ?? "-"}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.weightHeavey}>
                User Address: {user.get("ethAddress")}
            </Text>
        </View>
    );
}

const HomePage = ({navigation}) => {
    const connector = useWalletConnect();
    const [email, setEmail] = React.useState("Test@test3.com");
    const [password, setPassword] = React.useState("Pass@1234");
    const {
        authenticate,
        authError,
        isAuthenticating,
        isAuthenticated,
        logout,
        Moralis,
    } = useMoralis();

    const signUp = async () => {
        const user = new Moralis.User();
        user.set("username", email);
        user.set("password", password);
        try {
            await user.signUp();
        } catch (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    }

    const login = async () => {
        // navigation.replace("BottomTabNavigation");
        try {
            const user = await Moralis.User.logIn(email, password);
            if (user){
                navigation.replace("BottomTabNavigation");
                // navigation.navigate("BottomTabNavigation");
            }
        } catch (error) {
            // Show the error message somewhere and let the user try again.
            console.log("Error: " + error.code + " " + error.message);
        }
// Do stuff after successful login.
    }

    return (
        <View style={[StyleSheet.absoluteFill, styles.white]}>
            <View>
                <Header
                    backgroundImageStyle={{}}
                    barStyle="default"
                    centerComponent={{
                        text: "My Awesome DAPP",
                        style: {color: "#fff"},
                    }}
                    centerContainerStyle={{}}
                    containerStyle={{}}
                    // leftComponent={{icon: "menu", color: "#fff"}}
                    leftContainerStyle={{}}
                    placement="center"
                    // rightComponent={{icon: "home", color: "#fff"}}
                    rightContainerStyle={{}}
                    statusBarProps={{}}
                />
            </View>
            <View style={[styles.white, styles.center]}>
                <View style={styles.marginLarge}>
                    {authError && (
                        <>
                            <Text>Authentication error:</Text>
                            <Text style={styles.margin}>{authError.message}</Text>
                        </>
                    )}
                    {isAuthenticating && (
                        <Text style={styles.margin}>Authenticating...</Text>
                    )}
                    {!isAuthenticated && (
                        <>
                            <TextInput
                                style={{
                                    height: 40,
                                    margin: 12,
                                    borderWidth: 1,
                                    padding: 10,
                                }}
                                onChangeText={setEmail}
                                value={email}
                                placeholder="Email"
                            />
                            <TextInput
                                style={{
                                    height: 40,
                                    margin: 12,
                                    borderWidth: 1,
                                    padding: 10,
                                }}
                                onChangeText={setPassword}
                                // onChangeText={(event) => setPassword(event.target.value)}
                                value={password}
                                placeholder="Password"
                            />
                            <Button
                                buttonStyle={{width: 200, backgroundColor: "#1370f2"}}
                                containerStyle={{margin: 5}}
                                disabledStyle={{
                                    borderWidth: 2,
                                    borderColor: "#00F",
                                }}
                                onPress={() => signUp()}
                                loadingProps={{animating: true}}
                                title="SignUp With Email & Password"/>
                            <Button
                                buttonStyle={{width: 200, backgroundColor: "#1370f2"}}
                                containerStyle={{margin: 5}}
                                disabledStyle={{
                                    borderWidth: 2,
                                    borderColor: "#00F",
                                }}
                                onPress={() => login()}
                                loadingProps={{animating: true}}
                                title="Authenticate With Email & Password"/>
                            <Button
                                buttonStyle={{width: 200, backgroundColor: "green"}}
                                containerStyle={{margin: 5}}
                                disabledStyle={{
                                    borderWidth: 2,
                                    borderColor: "#00F",
                                }}
                                onPress={() => authenticate({connector})}
                                loadingProps={{animating: true}}
                                title="Authenticate With Crypto Wallet"/>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <Button
                                buttonStyle={{width: 200, backgroundColor: "red"}}
                                containerStyle={{margin: 5}}
                                disabledStyle={{
                                    borderWidth: 2,
                                    borderColor: "#00F",
                                }}
                                onPress={() => logout()}
                                title="Logout"/>
                        </>
                    )}
                </View>
                {isAuthenticated && (
                    <View>
                        <UserExample/>
                        <Web3ApiExample/>
                    </View>
                )}
            </View>
        </View>
    );
}

export default HomePage;
