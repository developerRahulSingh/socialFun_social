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
    ActivityIndicator
} from "react-native";
import {Icon} from "react-native-elements";
import {launchImageLibrary} from "react-native-image-picker";
import {
    useMoralis,
    useNewMoralisObject,
    useMoralisCloudFunction,
} from "react-moralis";

const SettingPage = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [shareFunnyMoment, setShareFunnyMoment] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [imageResourcePath, setImageResourcePath] = React.useState([]);
    const [imageSourcePath, setImageSourcePath] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const {Moralis, user,} = useMoralis();
    const {data, isLoading} = useMoralisCloudFunction("getAllPost");
    const {isSaving, save, error} = useNewMoralisObject("UserPosts");
    const [moralisData, setMoralisData] = React.useState([]);

    useEffect(() => {
        if (data === null) {
            console.log("Loading ==>> ");
        } else {
            let arr = JSON.parse(JSON.stringify(data));
            setMoralisData(arr);
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
        launchImageLibrary(options, (res) => {
            // console.log('Response = ', res);
            if (res.didCancel) {
                // console.log('User cancelled image picker');
            } else if (res.error) {
                // console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                // console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                const source = {uri: res.uri};
                // console.log('response source==>> ', source);
                // setImageResourcePath(r.assets);
            }
        }).then(async (r) => {
            setImageResourcePath(r.assets);
            imageResourcePath.map(async (val) => {
                setImageSourcePath(val.uri);
                const file = new Moralis.File(val.fileName, val);
                const data = await file.saveIPFS();
                setAvatar(file.url());
            });
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

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{paddingVertical: 8, width: "90%"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={styles.modalText}>Create Post</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="times-circle" type="font-awesome" size={24}/>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={{
                                    height: 80,
                                    marginVertical: 8,
                                    borderWidth: 1,
                                    padding: 8,
                                }}
                                placeholder={"Share funny moment"}
                                onChangeText={setShareFunnyMoment}
                                value={shareFunnyMoment}
                            />
                            <TouchableOpacity
                                style={{
                                    height: 160,
                                    width: "auto",
                                    borderRadius: 4,
                                    borderWidth: 2,
                                    borderStyle: "dashed"
                                }}
                                onPress={selectFile}
                            >
                                {imageSourcePath === "" ?
                                    <View style={{justifyContent: "center", flex: 1, alignItems: "center"}}>
                                        <Icon name="cloud-upload" type="font-awesome" size={40}></Icon>
                                        <Text>Upload Meme(PNG, JPG, GIF, MP4.)</Text>
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
                            <TextInput
                                style={{
                                    height: 40,
                                    marginVertical: 8,
                                    borderWidth: 1,
                                    padding: 8,
                                }}
                                placeholder={"#Tags e.g #blockchain #Ether"}
                                onChangeText={setTags}
                                value={tags}
                            />

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
                            <View style={{padding: 8}}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Mint and Publish</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    position: 'absolute',
                    bottom: 32,
                    // right: 10,
                    height: 70,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                }}
                onPress={() => setModalVisible(true)}
            >
                <Icon name='plus' size={30} color='#01a699' type="font-awesome"/>
            </TouchableOpacity>

            {moralisData === null
                ? <ActivityIndicator size="large"/>
                : moralisData.map((val) => {
                    return <View key={val.objectId}>
                        <Image
                            source={{uri: val.saveData.postImage === null ? 'https://via.placeholder.com/100' : val.saveData.postImage}}
                            style={{height: 100, width: 100}}
                        />
                    </View>
                })}
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 4,
        padding: 8,
        alignItems: "center",
        shadowColor: "#000",
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
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        // textAlign: "center"
    }
});

export default SettingPage;
