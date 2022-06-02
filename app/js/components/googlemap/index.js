import React, { Component } from "react";
import { compose } from "recompose";
import { GETSTOCKGAS } from "./../../config/config";
import callApi from "./../../util/apiCaller";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import getUserCookies from "../../helpers/getUserCookies";
const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <GoogleMap
      defaultZoom={5}
      defaultCenter={{ lat: 14.058324, lng: 108.277199 }}
    >
      {props.markers.map((marker) => {
        const onClick = props.onClick.bind(this, marker);
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{
              lat: Number.isNaN(marker.LAT)
                ? marker.LAT
                : parseFloat(marker.LAT),
              lng: Number.isNaN(marker.LNG)
                ? marker.LNG
                : parseFloat(marker.LNG),
            }}
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
               
                  <div>
                  {marker.name} 
                  <br></br>
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?"Khai báo mới :" :""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?marker.createdCylinder:""} 
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?<br></br>:""}
                  Tồn Kho: {marker.soluong}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?<br></br>:""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?" Xuất hàng :" :""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?marker.exportCylinder:""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?<br></br>:""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?"Hồi lưu :" :""}
                  {marker.userRole=== "Owner" && marker.userType==="Factory"?marker.turnbackCylinder:""}
                  <br></br>
                  {!(marker.userRole=== "Owner" && marker.userType==="Factory")?"Nhập hàng :" :""}
                  {!(marker.userRole=== "Owner" && marker.userType==="Factory")?marker.importCylinder:""} 
                </div>
             
               
                
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
});

export default class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelters: [],
      selectedMarker: false,
    };
  }
  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let email = user_cookie.user.email;
    let token = "Bearer " + user_cookie.token;
    let params = {
      email: email,
    };
    await callApi("POST", GETSTOCKGAS, params, token).then((res) => {
      if (res.data.data.length <= 0) {
        this.setState({
          shelters: [
            {
              name: "empty",
              soluong: 0,
            },
          ],
        });
      } else {
        this.setState(
          {
            shelters: res.data.data,
          },
          () => console.log(this.state.shelters)
        );
      }
    });
  }
  handleClick = (marker, event) => {
    // console.log({ marker })
    this.setState({ selectedMarker: marker });
  };
  render() {
    return (
      <MapWithAMarker
        selectedMarker={this.state.selectedMarker}
        markers={this.state.shelters}
        onClick={this.handleClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQijKBn8WZi84WmijJBy5c0qT9Rmk7rzE&libraries=geometry,drawing,places&language=vi&region=VN"
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={
          <div
            className="map"
            style={{
              position: "absolute",
              top: 64,
              left: 260,
              bottom: 0,
              right: 0,
            }}
            >
            </div>
        }
        mapElement={<div style={{ height: "100%" }} />}
      />
    );
  }
}
