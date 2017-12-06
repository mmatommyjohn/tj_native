import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AppRegistry,
  Image,
  View,
  DeviceEventEmitter
} from "react-native";

import Beacons from "react-native-beacons-manager";
const regions = [
  {
    uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
    identifier: "TJ HQ",
    latitude: 40.7081,
    longitude: -74.0112
  }
];

const beaconsRegistry = [
  {
    uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
    major: 30684,
    minor: 8638,
    name: "muhammad yellow beacon",
    imgUrl:
      "https://img.buzzfeed.com/buzzfeed-static/static/2017-07/5/14/enhanced/buzzfeed-prod-fastlane-03/enhanced-17346-1499278727-21.jpg?downsize=715:*&output-format=auto&output-quality=auto"
  },
  {
    uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
    major: 60742,
    minor: 19571,
    name: "muhammad purple beacon",
    imgUrl:
      "https://4fi8v2446i0sw2rpq2a3fg51-wpengine.netdna-ssl.com/wp-content/uploads/2016/06/KittenProgression-Darling-week6.jpg"
  }
];

function filterWithRegistryData(beacon) {
  return (
    beaconsRegistry.filter(
      b => b.major === beacon.major && b.minor === beacon.minor
    ).length > 0
  );
}

function mergeWithRegistryData(beacon) {
  return beaconsRegistry
    .filter(
      ({ uuid: rUUID, major: rMajor, minor: rMinor }) =>
        rUUID === beacon.uuid &&
        rMajor === beacon.major &&
        rMinor === beacon.minor
    )
    .reduce((acc, rBeacon) => ({ ...acc, ...rBeacon }), beacon);
}

export default class TJBeacon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      beacons: []
    };
  }
  componentWillMount() {
    console.log("compononte will mount");
    Beacons.requestWhenInUseAuthorization();
    console.log(navigator);
    console.log(regions);
    // navigator.geolocation.getCurrentPosition(
    //   ({ coords: { latitude, longitude } }) => {
    //     console.log(coords);
    //     const region = regions.filter(
    //       ({ latitude: rLatitude, longitude: rLongitude }) =>
    //         parseFloat(latitude).toFixed(4) ===
    //           parseFloat(rLatitude).toFixed(4) &&
    //         parseFloat(longitude).toFixed(4) ===
    //           parseFloat(rLongitude).toFixed(4)
    //     );
    //     if (region.length > 0) {
    //       region.map(({ uuid, identifier }) =>
    //         Beacons.startRangingBeaconsInRegion({
    //           identifier,
    //           uuid
    //         })
    //       );
    //       this.setState({ region });
    //     } else {
    //       console.log("not in region");
    //     }
    //   }
    // );

    Beacons.startRangingBeaconsInRegion(regions[0]);

    Beacons.startUpdatingLocation();
  }
  componentDidMount() {
    console.log("component did mount");
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      "beaconsDidRange",
      ({ beacons }) => {
        console.log("beacons did range!", beacons);
        this.setState({ beacons });
      }
    );
  }

  render() {
    const { beacons } = this.state;
    let nearOnes = beacons.filter(
      b => b.proximity === "near" || b.proximity === "immediate"
    );
    console.log("near or immediate:", nearOnes);
    return (
      <View>
        {nearOnes
          .filter(filterWithRegistryData)
          .map(mergeWithRegistryData)
          .map(this.renderRow)}
      </View>
    );
  }

  renderRow = item => {
    return (
      <View key={`${item.uuid}-${item.major}-${item.minor}`}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: item.imgUrl }}
        />
        <Text>{item.name}</Text>
        <Text>UUID: {item.uuid ? item.uuid : "NA"}</Text>
      </View>
    );
  };
}

AppRegistry.registerComponent("boxers", () => TJBeacon);
