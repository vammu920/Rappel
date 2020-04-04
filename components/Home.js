import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { height, width } from 'react-native-dimension';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import firebase from 'firebase';
export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            preciseLat: 0,
            preciseLong: 0,
            whichRoom: '',
            AreaList: null,
            roomList: null,
            TaskList: null,
            currentTask: null,
            taskLocationId: '',
        };
    }
     componentDidMount() {
        firebase.database().ref('Area').on('value', (AreaList) => {
            areaList = [];
            roomList = [];
            let i = 0;
            AreaList.forEach((element) => {
                areaList.push(element.val());
                roomList.push(element.val()['EdgeCoords']);
                roomList[i]['name'] = element.val()['AreaName'];
                i++;
            })
            this.state.AreaList = areaList;
            this.state.roomList = roomList;
            ///this.setState({ AreaList: areaList , roomList:roomList});
            console.log(this.state.roomList)
        });
        firebase.database().ref('Task').on('value', (TaskList) => {
            tastList = [];
            let i = 0;
            TaskList.forEach(element => {
                tastList.push(element.val());
                i++;
            })
            this.setState({ TaskList: tastList });
            console.log(this.state.TaskList);
        })
        var options = {
            enableHighAccuracy: true,
            distanceFilter: 1,
        };

        roomChecker = (latitude, longitude, rooms, area, tasks) => {
            if (this.state.roomList != null && this.state.AreaList!=null && this.state.TaskList!=null) { 
                for (let i = 0; i < rooms.length; i++) {
                    if (latitude > rooms[i]["latMin"] && longitude > rooms[i]["longMin"]) {
                        if (latitude < rooms[i]["latMax"] && longitude < rooms[i]["longMax"]) {
                            var taskLocationId = area[i]['id'];
                            var currentTask = [];
                            for (let j = 0; j < tasks.length; j++) {
                                if (tasks[j]['LocationId'] == taskLocationId) {
                                    currentTask.push(tasks[j]);
                                }
                            }
                            this.setState({ whichRoom: rooms[i]["name"], taskLocationId: taskLocationId, currentTask: currentTask });
                            console.log('you are in ' + this.state.whichRoom + "'s room with taskId: " + this.state.taskLocationId);
                            console.log(this.state.currentTask[0])
                        }
                    }
                }
            }

        }
        Geolocation.watchPosition((info => {
            //console.log(info.coords.latitude + " " + info.coords.longitude);
            this.setState({ latitude: info.coords.latitude.toFixed(5), preciseLat: info.coords.latitude, longitude: info.coords.longitude.toFixed(5), preciseLong: info.coords.longitude });
            //write you logic here
            console.log('%c current Coords:' + info.coords.latitude + " " + info.coords.longitude, 'background: #222; color: #bada55');
            roomChecker(this.state.preciseLat, this.state.preciseLong, this.state.roomList, this.state.AreaList, this.state.TaskList);
        }),
            ((error) => {
                console.log(error);
            }), options);
    }

    static navigationOptions = { header: null };
    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent:'center', width:width(100),}}>
                    <Text>Current Location: {this.state.whichRoom}</Text>
                    {(this.state.currentTask != null && this.state.currentTask!=[] && this.state.currentTask.length!=0) ? (<Text style={{ justifyContent: 'center', }}>YOUR CURRENT TASK : {this.state.currentTask[0]['TaskHeading'] + "  "} 
                        TASK DESCRIPTION : {this.state.currentTask[0]['TaskDescription']+ "  "} 
                         GIVEN BY : {this.state.currentTask[0]['GivenBy']} </Text>) : (<View />)}
                </View>

                <Image style={styles.logo} source={require('../images/logo.png')} />
                <View style={styles.locationBox}>
                    <View style={styles.locationBoxTitle}>
                        <Text style={styles.locationBoxTextTitle}>Your Current Coordinates</Text>
                    </View>
                    <View style={styles.locationBoxCoord}>
                        <View style={styles.locationBoxCoordLeft}>
                            <Text>Lat: {this.state.latitude}</Text>
                        </View>
                        <View style={styles.locationBoxCoordRight}>
                            <Text>Long: {this.state.longitude}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttons}>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('AddTask')
                        }}>
                            <Text style={styles.text}>Add New Task</Text>
                        </TouchableOpacity></View>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('TaskList')
                        }}>
                            <Text style={styles.text}>Check Tasks</Text>
                        </TouchableOpacity></View>
                </View>
                <View style={styles.buttons}>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            this.props.navigation.navigate('CentreOfRoom')
                        }}>
                            <Text style={styles.text}>Contribute Location</Text>
                        </TouchableOpacity></View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-around'
    },
    logo: {
        width: width(80),
        height: height(40),
    },
    locationBox: {
        width: width(80),
        height: height(20),
        borderWidth: 1,
        borderColor: '#eee',
    },
    buttons: {
        width: width(80),
        height: height(10),

        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#574F75',
        height: '80%',
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 13,
    },
    locationBoxTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationBoxCoord: {
        flex: 1,
        flexDirection: 'row',

    },
    locationBoxCoordLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationBoxCoordRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationBoxTextTitle: {
        fontSize: 17
    }
});
export default Home
