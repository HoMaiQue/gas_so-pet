import React, { Component } from "react";
import { Row, Col, Icon, Table, Input, Button } from "antd";
import {withNamespaces} from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Sector,
  Cell,
  Text,
  ResponsiveContainer,
  Line,
} from "recharts";
import { compose } from "recompose";
import { GETSTOCKGAS } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import getUserCookies from "./../../../helpers/getUserCookies";
import './dashboard.scss';
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
                  {marker.name} : {marker.soluong}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
});
const screen = window.screen;
const h = screen.height;
class ShowPieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelters: [],
      selectedMarker: false,
      listTopExportCylinder:[]
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
      // console.log("Test bug empty:",res.data)
      let temp=res.data.data?res.data.data:[]
      if (temp.length <= 0) {
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

  componentWillReceiveProps(nextProps){
    this.setState({
      listTopExportCylinder:nextProps.listTopExportCylinder
    })
  }

  handleClick = (marker, event) => {
    // console.log({ marker })
    this.setState({ selectedMarker: marker });
  };
  
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#0080FF", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      listCylinde: [],
      displayTable: false,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  render() {
    const columns = [
      {
        title: "Đơn vị",
        dataIndex: "name",
        key: "name",
        
      },
      {
        title: "Số lượng",
        dataIndex: "numberOfCylinder",
        key: "numberOfCylinder",
        
      },
    ];
    return (
      <Col className="container showReport">
        <Col className="modal fade" id="shoe-piechart" tabIndex="-1">
          <Col className="modal-dialog modal-lg modal-lg-show">
            <Col className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.t('SEE_STATISTIC')}</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <Col className="modal-body">
                <Row>
                  <Col md={12}>
  
                    <div style={{ height: "45%",width:'100%' }}>
                    <div style={{fontWeight:'bold',textAlign:'left',alignItems:'left',alignContent:'left'}}>{this.props.t('MAP')}</div>
                      <MapWithAMarker
                        selectedMarker={this.state.selectedMarker}
                        markers={this.state.shelters}
                        onClick={this.handleClick}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQijKBn8WZi84WmijJBy5c0qT9Rmk7rzE&libraries=geometry,drawing,places&language=vi&region=VN"
                        loadingElement={<div style={{ height: "90%",width:'90%' }} />}
                        containerElement={<div style={{ height: h * 0.47 }} />}
                        mapElement={<div style={{ height: "90%" }} />}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="table-toplist" style={{ height: "45%",width:'99%',paddingLeft:15 }}>
                    <div style={{fontWeight:'bold',textAlign:'left',alignItems:'left',alignContent:'left'}}>{this.props.t('TOP')}</div>
                    
                      <ResponsiveContainer width="100%" height={h * 0.42}>
                    <BarChart
                      height={h * 0.42}
                      data={this.state.listTopExportCylinder}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} label={<Text width={50} />} />
                      <Tooltip />
                      <Bar dataKey="numberOfCylinder" fill="#8884d8" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <div style={{ height: "47%" ,width:'100%'}}>
                    <div style={{fontWeight:'bold',textAlign:'left',alignItems:'left',alignContent:'left'}}>{this.props.t('DELIVERY_CHART')}</div>
                    <ResponsiveContainer width="100%" height={h * 0.42}>
                    <BarChart
                      height={h * 0.42}
                      data={this.props.dataBarChart}
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" label={<Text width={30} />} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bình" barSize={15} fill="#1890FF" />
                    </BarChart>
                  </ResponsiveContainer>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div style={{ height: "47%",width:'98%',paddingLeft:15 }}>
                    <div style={{fontWeight:'bold',textAlign:'left',alignItems:'left',alignContent:'left'}}>{this.props.t('INVENTORY_CHART')}</div>
                      <ResponsiveContainer height={h * 0.38} width="100%">
                        <PieChart>
                          <Pie
                            data={
                              this.props.checkDataChart.length === 0
                                ? this.props.dataPieChart
                                : this.props.data
                            }
                            labelLine={false}
                            label={this.props.renderCustomizedLabel}
                            outerRadius={h * 0.14}
                            cx="45%"
                            cy={h * 0.13}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {this.props.checkDataChart.length === 0
                              ? this.props.dataPieChart.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      this.props.COLORS[
                                        index % this.props.COLORS.length
                                      ]
                                    }
                                  />
                                ))
                              : this.props.data.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      this.props.COLORS[
                                        index % this.props.COLORS.length
                                      ]
                                    }
                                  />
                                ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Col>
        </Col>
      </Col>
    );
  }
}
export default withNamespaces()(ShowPieChart);