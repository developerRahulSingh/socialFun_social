import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform, ActivityIndicator,
} from "react-native";
import {useMoralisCloudFunction} from "react-moralis";
import {pageStyle} from "./deals.page.style";
import moment from "moment";

const DealsPage = ({navigation}) => {
    const {data, isLoading, error} = useMoralisCloudFunction("getAllDeals");
    const [dealsData, setDealsData] = React.useState([]);
    useEffect(() => {
        if (data === null) {
            console.log("Loading ==>> ");
        } else {
            let arr = JSON.parse(JSON.stringify(data));
            setDealsData(arr);
        }
    }, [isLoading, error]);

    const renderItems = ({item}) => {
        const endDate = moment(item.superDeals.end.iso).format("MMM-DD-YYYY");
        const startDate = moment(item.superDeals.start.iso).format("MMM-DD-YYYY");
        return (
            <View style={pageStyle.flatLisRenderItemStyle}>
                <View style={{
                    flexDirection: 'row',
                    padding: 8,
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: "#666666"}}>
                            {item.superDeals.title}
                        </Text>
                    </View>
                </View>
                <Image
                    source={{uri: `${item.superDeals.img}`}}
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
                        >Eligiility : </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text
                            style={[pageStyle.flatListRenderItemTextStyle]}
                        >$ {item.superDeals.eligiility}</Text>
                    </View>
                </View>

                <View style={{flexDirection: "row"}}>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle, pageStyle.colorTextStyle]}>
                            Offers :
                        </Text>
                    </View>
                    <View style={{width: "50%"}}>
                        <Text style={[pageStyle.flatListRenderItemTextStyle]}>
                            {item.superDeals.offers}
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
                data={dealsData}
                renderItem={renderItems}
                keyExtractor={item => item.objectId}
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => ItemSeparatorComponent(highlighted))}
            />
        </View>
    );
}

export default DealsPage;
