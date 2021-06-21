"use strict";

document.body.addEventListener('touchmove', function (e) {
  if (e._isScroller) return e.preventDefault();
}, {
  passive: false
});
var googleMap = new Vue({
  el: '#app',
  data: {
    map_center: {
      lat: 25.028399792445832,
      lng: 121.5205750394443
    },
    map: null,
    distance_array: [7, 5, 3],
    //單位：公尺
    circleColor: ['#F00', '#0F0', '#00F'],
    circles: [],
    marker: {},
    geocoder: null,
    address: '',
    search_pos: {
      lat: '',
      lng: ''
    },
    search_marker: false,
    distance: 500,
    search_result: ''
  },
  watch: {
    address: function address() {
      this.hasResult = false;
    }
  },
  methods: {
    // init google map
    initMap: function initMap() {
      var _this = this;

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: this.map_center,
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: true,
        scaleControl: true,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });
      this.distance_array.forEach(function (dis, index) {
        _this.circles[index] = new google.maps.Circle({
          center: _this.map_center,
          radius: dis * 1000,
          strokeColor: _this.circleColor[index],
          strokeOpacity: 1,
          fillColor: _this.circleColor[index],
          fillOpacity: 0.1,
          map: _this.map
        });
        _this.marker = new google.maps.Marker({
          position: _this.map_center,
          map: _this.map,
          label: '小村子'
        });
      });
    },
    search: function search() {
      var _this2 = this;

      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode( // GeocoderRequest 物件: 帶入要轉換的地址與相關設定
      {
        // 地址
        address: this.address,
        // 限制轉換的結果必須是在台灣的範圍
        componentRestrictions: {
          country: "TW"
        }
      }, // 轉換完成後呼叫的 callback 函式
      function (results, status) {
        if (status === "OK") {
          // 當轉換成功時，將第一筆結果的經緯度存取起來
          _this2.search_pos.lat = results[0].geometry.location.lat();
          _this2.search_pos.lng = results[0].geometry.location.lng();

          if (_this2.search_marker) {
            _this2.search_marker.setMap(null);
          }

          _this2.search_marker = new google.maps.Marker({
            position: _this2.search_pos,
            map: _this2.map,
            animation: google.maps.Animation.DROP
          });

          _this2.moveMap();

          _this2.search_result = _this2.address;
        } else {
          // 當轉換失敗時，顯示錯誤原因
          console.log(results);
        }
      });
    },
    moveMap: function moveMap() {
      this.map.panTo(this.search_pos);
      this.measureDis();
      this.hasResult = true;
    },
    measureDis: function measureDis() {
      var R = 6371.0710; // Radius of the Earth in kilometer

      var rlat1 = this.map_center.lat * (Math.PI / 180); // Convert degrees to radians

      var rlat2 = this.search_pos.lat * (Math.PI / 180); // Convert degrees to radians

      var difflat = rlat2 - rlat1; // Radian difference (latitudes)

      var difflon = (this.search_pos.lng - this.map_center.lng) * (Math.PI / 180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
      this.distance = this.roundX(d, 2);
    },
    roundX: function roundX(val, precision) {
      return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, precision || 0);
    },
    distance_money: function distance_money(val) {
      var money = 300;

      if (val < this.distance_array[1]) {
        money = 200;
      }

      if (val < this.distance_array[2]) {
        money = 100;
      }

      return money;
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    window.addEventListener('load', function () {
      _this3.initMap();
    });
  }
});