import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Platform,
    Alert,
    TextInput,
    Modal, StyleSheet,
} from "react-native";
import {useMoralis, useMoralisCloudFunction, useNewMoralisObject} from "react-moralis";
import {pageStyle} from "./allContest.page.style";
import moment from "moment";
import {launchImageLibrary} from "react-native-image-picker";
import {Icon} from "react-native-elements";

const AllContestPage = ({navigation}) => {
    const {data, isLoading, error} = useMoralisCloudFunction("getAllContest");
    const [allContextData, setAllContextData] = React.useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [shareFunnyMoment, setShareFunnyMoment] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [imageResourcePath, setImageResourcePath] = React.useState([]);
    const [imageSourcePath, setImageSourcePath] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const {Moralis, user,} = useMoralis();
    // const {getAllPostData, getAllPostIsLoading} = useMoralisCloudFunction("getAllPost");
    // const {isSaving, save, error} = useNewMoralisObject("UserPosts");

    useEffect(() => {
        if (data === null) {
            console.log("Loading ==>> ");
        } else {
            let arr = JSON.parse(JSON.stringify(data));
            setAllContextData(arr);
        }
    }, [isLoading, error]);

    const selectFile = () => {
        const options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose file from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            // console.log('Response = ', res);
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', res.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', res.customButton);
                alert(response.customButton);
            } else {
                const selectedFile = JSON.parse(JSON.stringify(response));
                console.log('response source==>> ', selectedFile);
                setImageResourcePath(selectedFile.assets);
                imageResourcePath.map(async (val) => {
                    setImageSourcePath(val.uri);
                    const file = new Moralis.File(val.fileName, val);
                    const data = await file.saveIPFS();
                    setAvatar(file.url());
                });
            }
        }).then(r => console.log("r ==>> ", r));
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
            <FlatList
                style={pageStyle.flatListContainer}
                data={allContextData}
                renderItem={renderItem}
                keyExtractor={item => item.objectId}
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => ItemSeparatorComponent(highlighted))}
            />
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
}

export default AllContestPage;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:"#612897"
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
