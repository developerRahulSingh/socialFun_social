import React from "react";
import {
    NavigationContainer,
} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import LoginPage from "./screen/auth/login/login.page";
import SignUpPage from "./screen/auth/signUp/signUp.page";
import DashboardPage from "./screen/dashboard.page";
import SettingPage from './screen/setting.page';
import AllContestPage from "./screen/allContest.page";
import SplashScreen from "./component/SplashScreen";
import CreatedContestPage from "./screen/createdContest.page";
import DealsPage from "./screen/deals/deals.page";
import SuperWorldPage from "./screen/superWorld/superWorld.page";
import ParticipatedContestPage from "./screen/participatedContest.page";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontistoicons from 'react-native-vector-icons/Fontisto'

const Tab = createMaterialBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function Home(): JSX.Element {
    return (
        <Tab.Navigator
            shifting={false}
            activeColor={"#8236c9"}
            barStyle={{backgroundColor: "#ffffff"}}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color}) => {
                    let iconName;

                    if (route.name === 'Post') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'Context') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Deals') {
                        iconName = focused ? 'gift' : 'gift-outline';
                    } else if (route.name === 'Super World') {
                        iconName = focused ? 'world' : 'world-o';
                        return <Fontistoicons name={iconName} size={24} color={color}/>;
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={24} color={color}/>;
                },
            })}>
            <Tab.Screen
                name="Post"
                component={DashboardPage}
            />
            <Tab.Screen
                name="Context"
                component={Context}
            />
            <Tab.Screen
                name="Super World"
                component={SuperWorldPage}
            />
        </Tab.Navigator>
    );
}

function Context(): JSX.Element {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name="All" component={AllContestPage}/>
            <TopTab.Screen name="Participated" component={ParticipatedContestPage}/>
            {/*<TopTab.Screen name="Created" component={CreatedContestPage}/>*/}
        </TopTab.Navigator>
    );
}

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}}/>
                <Stack.Screen name="BottomTabNavigation" component={Home} options={{
                    title: 'SuperFun.Social',
                    headerStyle: {
                        backgroundColor: '#8236c9',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontStyle: "italic",
                        fontSize: 28
                    },
                    // headerShown: false,
                }}/>
                <Stack.Screen name="Setting" component={SettingPage}/>
                <Stack.Screen name="SignUp" component={SignUpPage} options={{headerShown: false}}/>
                <Stack.Screen name="Deals" component={DealsPage} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// @ts-ignore
export default App;

