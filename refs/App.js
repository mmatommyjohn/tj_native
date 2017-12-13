import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  ListView,
  DeviceEventEmitter
} from "react-native";

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

import Beacons from "react-native-beacons-manager";
console.log(Beacons);
import moment from "moment";

const TIME_FORMAT = "MM/DD/YYYY HH:mm:ss";

export default class beaconRangingOnly extends Component {
  // will be set as a reference to "beaconsDidRange" event:
  beaconsDidRangeEvent = null;
  // will be set as a reference to "authorizationStatusDidChange" event:
  authStateDidRangeEvent = null;

  state = {
    // region information
    uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
    identifier: "some id",
    rangingDataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }).cloneWithRows([])
  };

  componentWillMount() {
    const { identifier, uuid } = this.state;
    //
    // ONLY non component state aware here in componentWillMount
    //

    // OPTIONAL: listen to authorization change
    // MANDATORY: Request for authorization while the app is open
    //           -> this is the authorization set by default by react-native init in the info.plist file
    // RANGING ONLY (this is not enough to make MONITORING working)
    Beacons.requestAlwaysAuthorization();
    // Define a region which can be identifier + uuid,
    // identifier + uuid + major or identifier + uuid + major + minor
    // (minor and major properties are numbers)
    const region = { identifier, uuid };
    // Range for beacons inside the region
    Beacons.startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
      .then(d => console.log("Beacons ranging started succesfully", d))
      .catch(error =>
        console.log(`Beacons ranging not started, error: ${error}`)
      );
  }

  componentDidMount() {
    //
    // component state aware here - attach events
    //

    // Ranging: Listen for beacon changes
    this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
      "beaconsDidRange",
      data => {
        //  console.log('beaconsDidRange data: ', data);
        this.setState({
          rangingDataSource: this.state.rangingDataSource.cloneWithRows(
            data.beacons,
            beacons
          )
        });
      }
    );
  }

  componentWillUnMount() {
    const { identifier, uuid } = this.state;
    const region = { identifier, uuid };
    // stop ranging beacons:
    Beacons.stopRangingBeaconsInRegion(region)
      .then(() => console.log("Beacons ranging stopped succesfully"))
      .catch(error =>
        console.log(`Beacons ranging not stopped, error: ${error}`)
      );
    // remove auth state event we registered at componentDidMount:
    this.authStateDidRangeEvent.remove();
    // remove ranging event we registered at componentDidMount:
    this.beaconsDidRangeEvent.remove();
  }

  render() {
    const { rangingDataSource } = this.state;
    console.log(rangingDataSource);
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>ranging beacons in the area:</Text>
        <ListView
          dataSource={rangingDataSource}
          enableEmptySections={true}
          renderRow={this.renderRangingRow}
        />
      </View>
    );
  }

  renderRangingRow(rowData) {
    console.log(rowData);
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: {rowData.uuid ? rowData.uuid : "NA"}
        </Text>
        <Text style={styles.smallText}>
          Major: {rowData.major ? rowData.major : "NA"}
        </Text>
        <Text style={styles.smallText}>
          Minor: {rowData.minor ? rowData.minor : "NA"}
        </Text>
        <Text>RSSI: {rowData.rssi ? rowData.rssi : "NA"}</Text>
        <Text>Proximity: {rowData.proximity ? rowData.proximity : "NA"}</Text>
        <Text>
          Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : "NA"}m
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btleConnectionStatus: {
    fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    padding: 8,
    paddingBottom: 16
  },
  smallText: {
    fontSize: 11
  }
});
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

AppRegistry.registerComponent("boxers", () => beaconRangingOnly);
