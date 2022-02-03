import React, {useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform,
} from "react-native";
import {useMoralisCloudFunction} from "react-moralis";
import {pageStyle} from "./participatedContest.page.style";
import moment from "moment";

const ParticipatedContestPage = ({navigation}) => {
    const {data, isLoading, error} = useMoralisCloudFunction("getAllContest");
    const [allParticipatedContextData, setAllParticipatedContextDat] = React.useState([]);

    useEffect(() => {
        if (data === null) {
            console.log("Loading ==>> ");
        } else {
            let arr = JSON.parse(JSON.stringify(data));
            setAllParticipatedContextDat(arr);
        }
    }, [isLoading, error]);

    const renderItem = ({item}) => {
        const endDate = moment(item.contestData.end.iso).format("MMM-DD-YYYY");
        const startDate = moment(item.contestData.start.iso).format("MMM-DD-YYYY");
        return (
            <View style={pageStyle.flatLisRenderItemStyle}>
                <View style={{
                    flexDirection: 'row',
                    padding: 8,
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: "#666666"}}>
                            {item.contestData.title}
                        </Text>
                    </View>
                </View>
                <Image
                    source={{uri: `${item.contestData.img}`}}
                    style={{height: 320, width: "100%"}}/>

                <Text style={[pageStyle.flatListRenderItemTextStyle, {
                    color: "#666666",
                    fontSize: 20,
                }]}>{item.user.objectId}</Text>

                <View style={{flexDirection: "row",}}>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle, pageStyle.colorTextStyle]}
                        >Start Date : </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle]}>{startDate}</Text>
                    </View>
                </View>

                <View style={{flexDirection: "row"}}>
                    <View style={{width: "50%"}}>
                        <Text
                            style={[pageStyle.flatListRenderItemTextStyle, pageStyle.colorTextStyle]}
                        >End Date : </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text
                            style={[pageStyle.flatListRenderItemTextStyle]}
                        >{endDate}</Text>
                    </View>
                </View>

                <View style={{flexDirection: "row"}}>
                    <View style={{width: "50%"}}>
                        <Text
                            style={[pageStyle.flatListRenderItemTextStyle, pageStyle.colorTextStyle]}
                        >Prize : </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text
                            style={[pageStyle.flatListRenderItemTextStyle]}
                        >$ {item.contestData.prize}</Text>
                    </View>
                </View>

                <View style={{flexDirection: "row"}}>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle, pageStyle.colorTextStyle]}>
                            About :
                        </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle]}>
                            {item.contestData.description}
                        </Text>
                    </View>
                </View>

                <View style={{justifyContent: "center", elevation: 2, padding: 8}}>
                    <TouchableOpacity
                        style={[pageStyle.button, pageStyle.buttonClose]}
                        onPress={() => console.log("Button pressed ==>> ")}
                    >
                        <Text style={pageStyle.textStyle}>Participate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    const ItemSeparatorComponent = ({highlighted}) => (
        <View style={[
            highlighted && {marginLeft: 0,},
            {
                backgroundColor: "transparent",
                height: 8,
            }]}
        />
    );

    return (
        <View style={pageStyle.container}>
            <FlatList
                style={pageStyle.flatListContainer}
                data={allParticipatedContextData}
                renderItem={renderItem}
                keyExtractor={item => item.objectId}
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => ItemSeparatorComponent(highlighted))}
            />
        </View>
    );
}

export default ParticipatedContestPage;
