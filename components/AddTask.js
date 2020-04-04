import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { TextInput, Button,Drawer, List } from 'react-native-paper';
import { height, width } from 'react-native-dimension';
import firebase from 'firebase';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
class AddTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskHeading: '',
            TaskDescription: '',
            GivenBy: '',
            Location: '',
            active: 'first',
            AreaList:null,
            LocationId:''
        }
    }
    componentDidMount(){
        firebase.database().ref('Area').on('value', (AreaList) => {
           var AreaListArray=[];
            AreaList.forEach(element=>{
                AreaListArray.push(element.val());
            })
            
            this.setState({AreaList:AreaListArray});
            console.log(this.state.AreaList);
          })
    }
    onSubmit=async ()=>{
        await firebase.database().ref(`Task/`).push(
               {
                TaskHeading: this.state.TaskHeading,
                TaskDescription: this.state.TaskDescription,
                GivenBy: this.state.GivenBy,
                Location: this.state.Location,
                LocationId: this.state.LocationId,
                id:''
            }
           ).then(()=>{
               console.log('added');
           }).catch((error)=>{
               console.log(error)
           })  
           firebase.database().ref('Task').once('value', (AreaList) => {
            AreaList.forEach(element => {
              firebase.database().ref(`Task/${element.key}`).update({ id: element.key })
            })
          })
    }
    static navigationOptions = { header: null };
    render() {
        return (
            <View style={styles.container}>
            
                <Text style={styles.heading}> Rappel </Text>
                <TextInput
                    label='Task Heading'
                    value={this.state.TaskHeading}
                    style={styles.input}
                    onChangeText={TaskHeading => this.setState({ TaskHeading })}
                />
                <TextInput
                    label='Task Description'
                    value={this.state.TaskDescription}
                    style={styles.input}
                    onChangeText={TaskDescription => this.setState({ TaskDescription })}
                />
                <TextInput
                    label='Given By'
                    value={this.state.GivenBy}
                    style={styles.input}
                    onChangeText={GivenBy => this.setState({ GivenBy })}
                />
                <List.Section style={{width:width(80), }} title="choose Location">
        <List.Accordion title="Location">
          {(this.state.AreaList!=null)?(this.state.AreaList.map((arg)=>{
            return(<List.Item title={arg.AreaName} onPress={()=>{this.setState({Location:arg.AreaName, LocationId:arg.id})}} />)
          })):(<View></View>)}
        </List.Accordion>
      </List.Section>
                <Button mode="contained" style={styles.addTask} onPress={() => this.onSubmit()}>
                    Add Task
                 </Button>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    heading: {
        color: '#000',
        fontWeight: 'bold',
        fontSize:20,
        marginTop:20,
    

    },
    input: {
        width: width(80),
        margin:10,
    },
    addTask:{
        width:width(60),
        backgroundColor:'#574F75',
        marginTop:50,
    },
    tastList: {
        width:width(60),
        backgroundColor:'#eee',
        marginTop:20,
        justifyContent:'flex-end',
        color:'#000'
    }
});
export default AddTask
