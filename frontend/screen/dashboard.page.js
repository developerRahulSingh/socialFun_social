import React, {useEffect, useState} from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    FlatList,
} from "react-native";
import {Icon} from "react-native-elements";
import {launchImageLibrary} from "react-native-image-picker";
import {
    useMoralis,
    useNewMoralisObject,
    useMoralisCloudFunction,
} from "react-moralis";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionic from "react-native-vector-icons/Ionicons";

const DashboardPage = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [shareFunnyMoment, setShareFunnyMoment] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [imageSourcePath, setImageSourcePath] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const {Moralis, user,} = useMoralis();
    const {data, isLoading} = useMoralisCloudFunction("getAllPost");
    const {save, error} = useNewMoralisObject("UserPosts");
    const [moralisData, setMoralisData] = React.useState([]);
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

    console.log("user ==>> ", user);
    console.log("save ==>> ", save);

    const selectFile = async () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        const result = await launchImageLibrary(options);
        const imageData = JSON.parse(JSON.stringify(result.assets));
        imageData.map(async (val) => {
            setImageSourcePath(val.uri);
            const file = new Moralis.File(val.fileName, val);
            const saveIpfsData = await file.saveIPFS();
            console.log("file ==>> ", file)
            console.log("url ==>> ", file.url())
            console.log("saveIpfsData ==>> ", saveIpfsData);
            setAvatar(file.url());
        });
    };

    const createMoralisPost = async () => {
        const saveData = {
            title: shareFunnyMoment,
            postImage: avatar,
            tag: tags,
        }
        await save({saveData, user}).then((post) => {
            alert('New object created with objectId: ' + post.id);
        }, (error) => {
            alert('Failed to create new object, with error code: ' + error.message);
        }).catch((e) => {
            console.log("Error ==>> ", e);
        });
    };

    const renderItem = ({item}) => {
        // console.log("items ==>> ", item)
        return (
            <View style={{
                paddingBottom: 10,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.1,
            }}>
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

    const onRefreshList = async () => {
        const userPosts = Moralis.Object.extend("UserPosts");
        const query = new Moralis.Query(userPosts);
        const results = await query.find({useMasterKey: true});
        let arr = JSON.parse(JSON.stringify(results));
        setMoralisData(arr);
    };

    return (
        <View style={styles.centeredView}>
            {/*<ScrollView style={{width: "100%"}}>*/}
            {/*    <Post/>*/}
            {/*</ScrollView>*/}
            <FlatList
                style={styles.flatListContainer}
                data={moralisData}
                renderItem={renderItem}
                keyExtractor={item => item.objectId}
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => ItemSeparatorComponent(highlighted))}
                onRefresh={onRefreshList}
                refreshing={false}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{paddingVertical: 8, width: "90%"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={[styles.modalText]}>Create Post</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="times-circle" color={"grey"} type="font-awesome" size={32}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: "100%",
                                backgroundColor: "#f2f2f2",
                                marginVertical: 8,
                                borderRadius: 8,
                                overflow: "hidden"
                            }}>
                                <TextInput
                                    style={{
                                        height: 64,
                                        padding: 8,
                                        marginVertical: 8,
                                        width: "100%",
                                        fontSize: 18,
                                        color: "#404040"
                                    }}
                                    onChangeText={setShareFunnyMoment}
                                    value={shareFunnyMoment}
                                    placeholder={"Share funny moment"}
                                />
                                <View style={{
                                    backgroundColor: "grey",
                                    height: 4,
                                }}
                                />
                            </View>
                            <TouchableOpacity
                                style={{
                                    height: 160,
                                    width: "auto",
                                    borderRadius: 4,
                                    borderWidth: 2,
                                    borderColor: "#404040",
                                    borderStyle: "dashed",
                                    backgroundColor: "#f2f2f2"
                                }}
                                onPress={selectFile}
                            >
                                {imageSourcePath === "" ?
                                    <View style={{justifyContent: "center", flex: 1, alignItems: "center"}}>
                                        <Icon name="cloud-upload" color={"#8236c9"} type="font-awesome"
                                              size={40}/>
                                        <Text style={{fontSize: 16, color: "#404040"}}>Upload Meme(PNG, JPG, GIF,
                                            MP4.)</Text>
                                    </View>
                                    : <>
                                        <Image
                                            source={{
                                                uri: imageSourcePath,
                                            }}
                                            style={{width: "100%", height: 160}}
                                        />
                                    </>
                                }
                            </TouchableOpacity>
                            <View style={{
                                width: "100%",
                                backgroundColor: "#f2f2f2",
                                marginVertical: 8,
                                borderRadius: 8,
                                overflow: "hidden",
                            }}>
                                <TextInput
                                    style={{
                                        height: 40,
                                        padding: 8,
                                        marginVertical: 8,
                                        width: "100%",
                                        fontSize: 18,
                                        color: "#404040"
                                    }}
                                    placeholder={"#Tags e.g #blockchain #Ether"}
                                    onChangeText={setTags}
                                    value={tags}
                                />
                                <View style={{
                                    backgroundColor: "grey",
                                    height: 4,
                                }}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <View style={{padding: 8}}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={createMoralisPost}
                                >
                                    <Text style={styles.textStyle}>Publish</Text>
                                </TouchableOpacity>
                            </View>
                            {/*<View style={{padding: 8}}>*/}
                            {/*    <TouchableOpacity*/}
                            {/*        style={[styles.button, styles.buttonClose]}*/}
                            {/*        onPress={() => setModalVisible(!modalVisible)}*/}
                            {/*    >*/}
                            {/*        <Text style={styles.textStyle}>Mint and Publish</Text>*/}
                            {/*    </TouchableOpacity>*/}
                            {/*</View>*/}
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={{
                    borderWidth: 2,
                    borderColor: '#8236c9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 72,
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    height: 72,
                    backgroundColor: '#ffffff',
                    borderRadius: 48,
                }}
                onPress={() => setModalVisible(true)}
            >
                <Icon name='plus' size={30} color='#8236c9' type="font-awesome"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:"#612897"
    },
    flatListContainer: {
        width: "100%",
        padding: 8,
        borderRadius: 8,
    },
    modalView: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 8,
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        width: "80%"
    },
    button: {
        borderRadius: 4,
        padding: 8,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#8236c9",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
        fontSize: 24,
        fontWeight: "bold",
        color: "#8236c9"
    }
});

export default DashboardPage;
