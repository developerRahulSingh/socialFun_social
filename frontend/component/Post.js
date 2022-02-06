import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, Platform, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useMoralisCloudFunction} from "react-moralis";
import {pageStyle} from "../screen/allContest.page.style";

const Post = ({navigation}) => {
    const {data, isLoading, error} = useMoralisCloudFunction("getAllPost");
    const [moralisData, setMoralisData] = useState([]);
    const [like, setLike] = useState(false);
    const [comment, setComment] = useState(false);

    useEffect(() => {
        if (data === null) {
            console.log("Loading ==>> ");
        } else {
            let arr = JSON.parse(JSON.stringify(data));
            setMoralisData(arr);
        }
    }, [isLoading, error]);

    const renderItem = ({item}) => {
        return (
            <View style={{
                paddingBottom: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.1,
            }}>
                {/*<View*/}
                {/*  style={{*/}
                {/*    flexDirection: 'row',*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'space-between',*/}
                {/*    padding: 8,*/}
                {/*  }}>*/}
                {/*  <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                {/*    <Image*/}
                {/*      source={data.postPersonImage}*/}
                {/*      style={{width: 40, height: 40, borderRadius: 100}}*/}
                {/*    />*/}
                {/*    <View style={{paddingLeft: 5}}>*/}
                {/*      <Text style={{fontSize: 15, fontWeight: 'bold'}}>*/}
                {/*        {data.postTitle}*/}
                {/*      </Text>*/}
                {/*    </View>*/}
                {/*  </View>*/}
                {/*  <Feather name="more-vertical" style={{fontSize: 20}} />*/}
                {/*</View>*/}
                <View
                    style={{
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Image
                        source={{uri: item.saveData.postImage === null ? 'https://via.placeholder.com/100' : item.saveData.postImage}}
                        style={{width: '100%', height: 400}}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 15,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => setLike(!like)}>
                            <AntDesign
                                name={like ? 'heart' : 'hearto'}
                                style={{
                                    paddingRight: 10,
                                    fontSize: 20,
                                    color: like ? 'red' : 'black',
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={item.objectId ? () => setComment(!comment) : null}>
                            <Ionic
                                name="ios-chatbubble-outline"
                                style={{fontSize: 20, paddingRight: 10}}
                            />
                        </TouchableOpacity>
                        {/*<TouchableOpacity>*/}
                        {/*  <Feather name="navigation" style={{fontSize: 20}} />*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    {/*<Feather name="bookmark" style={{fontSize: 20}} />*/}
                </View>
                <View style={{paddingHorizontal: 15}}>
                    <Text>
                        Liked by{like ? ' you and' : ''}{' '}
                        {like ? like + 256 : "256"} others
                    </Text>
                    <Text
                        style={{
                            fontWeight: '700',
                            fontSize: 16,
                            paddingVertical: 2,
                        }}>
                        {item.saveData.title}
                    </Text>
                    <Text style={{
                        paddingVertical: 4,
                        fontWeight: "600",
                        color: "#8236c9",
                        fontSize: 16,
                    }}>
                        {item.saveData.tag}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 8,
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            {/*<Image*/}
                            {/*  source={data.postPersonImage}*/}
                            {/*  style={{*/}
                            {/*    width: 25,*/}
                            {/*    height: 25,*/}
                            {/*    borderRadius: 100,*/}
                            {/*    backgroundColor: 'orange',*/}
                            {/*    marginRight: 10,*/}
                            {/*  }}*/}
                            {/*/>*/}
                            {comment ?
                                <TextInput
                                    placeholder="Add a comment "
                                    style={{opacity: 0.5}}
                                />
                                :
                                null
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
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
        <View>
            <FlatList
                style={pageStyle.flatListContainer}
                data={moralisData}
                renderItem={renderItem}
                keyExtractor={item => item.objectId}
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => ItemSeparatorComponent(highlighted))}
            />
        </View>
    );
};

export default Post;
