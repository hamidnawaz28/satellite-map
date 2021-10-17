var mapMinZoom = 13;
var mapMaxZoom = 18;
var map = undefined;
let layerButtonOpen = false;
var isMaximized = false;
var layer;
var opacitySlider;

// var locateCSS = document.createElement("link");
// locateCSS.setAttribute("rel", "stylesheet");
// locateCSS.setAttribute(
//   "href",
//   "https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css"
// );
// document.head.appendChild(locateCSS);

// var locateScript = document.createElement("script");

// locateScript.setAttribute(
//   "src",
//   "https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.js"
// );
// document.head.appendChild(locateScript);
const mapBoxaccessToken =
  "sk.eyJ1IjoiaGFtaWRuYXdheiIsImEiOiJja3Mwbmh3MWcxNDZxMnZtcnFrYWFxYnpjIn0.TgEAWvFmUHY1kn7NgJokJg";
const googleAccessToken = "AIzaSyCT9kWOVDQFeQQgk68OwkZIwNbx9cwCvVA";

const mapStyles = {
  h: "Roads",
  m: "Standard",
  p: "Terrain",
  r: "Altered Roadmap",
  s: "Satellite ",
  t: "Terrain ",
  y: "Hybrid",
};

const bounds = new L.LatLngBounds(
  new L.LatLng(mapExtent[1], mapExtent[0]),
  new L.LatLng(mapExtent[3], mapExtent[2])
);

map = L.map("map", { zoomControl: false }).fitBounds(bounds);

// With Google api
var options = {
  minZoom: mapMinZoom,
  maxZoom: mapMaxZoom,
  opacity: 1.0,
  tms: false,
};

L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  ...options,
}).addTo(map);

const changeMapStyle = (style) => {
  L.tileLayer(`http://{s}.google.com/vt/lyrs=${style}&x={x}&y={y}&z={z}`, {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    ...options,
  }).addTo(map);
  layer = L.tileLayer("tiles/{z}/{x}/{y}.png", options).addTo(map);
  opacitySlider.setOpacityLayer(layer);
};

const layerChangeEvent = () => {
  let options = document.getElementsByClassName("options");
  Array.from(options).forEach((element) => {
    element.addEventListener("click", (e) => {
      let style = e.currentTarget.getAttribute("data-id");
      changeMapStyle(style);
    });
  });
};

// Add Tiles Layer

layer = L.tileLayer("tiles/{z}/{x}/{y}.png", options).addTo(map);

// Add Logo
const addLogo = (position, path, className, width) => {
  var logo = L.control({ position });

  logo.onAdd = () => {
    var div = L.DomUtil.create("div", className);
    div.innerHTML = `<img src=${path} width=${width}px />`;
    return div;
  };

  logo.addTo(map);
  return logo;
};

// Add Zoom
const addZoom = () => {
  L.Control.zoomHome({ position: "bottomright" }).addTo(map);
};

// Add GPS
const getCurrentLocation = () => {
  let marker = undefined;
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     debugger;
  //     const lat = position.coords.latitude;
  //     const lon = position.coords.longitude;
  //     const pos = [lat, lon];
  //     marker = gpsMarkerInstance(pos);
  //     map.flyTo(pos, 15);
  //     marker.addTo(map);
  //   });
  // }
  L.control.locate().addTo(map);

  function success(pos) {
    const { longitude, latitude } = pos.coords;
    var newLatLng = new L.LatLng(latitude, longitude);
    marker.setLatLng(newLatLng);
  }

  function error(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  }

  const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };

  // const watchID = navigator.geolocation.watchPosition(success, error, options);
};

const htmlBorderWrap = (iconHtml) =>
  `<div style="background-color: white; padding: 3px; border-radius: 2px">${iconHtml}</i></div>`;

const addGpsLogo = (iconPosition) => {
  var div = L.DomUtil.create("div", "max-icon");
  div.style.padding = "2px";
  div.style.borderRadius = "2px";
  div.style.cursor = "pointer";

  const locationIcon = htmlBorderWrap(
    `<i class="fas fa-crosshairs fa-2x"></i>`
  );

  div.innerHTML = locationIcon;
  // div.addEventListener("click", () => getCurrentLocation());

  L.control.locate({ position: iconPosition, drawCircle: false }).addTo(map);
};

// Add marker
const circleAnimation = (className) => {
  var myIcon = document.querySelector(className);

  setTimeout(function () {
    myIcon.style.width = "50px";
    myIcon.style.height = "50px";
    myIcon.style.marginLeft = "-25px";
    myIcon.style.marginTop = "-25px";
  }, 1000);

  setTimeout(function () {
    myIcon.style.width = "30px";
    myIcon.style.height = "30px";
    myIcon.style.borderRadius = "50%";
    myIcon.style.marginLeft = "-15px";
    myIcon.style.marginTop = "-15px";
  }, 2000);
};

const divIcon = () =>
  L.divIcon({
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [10, 0],
    shadowSize: [0, 0],
    className: "animated-icon my-icon",
    html: "",
  });

const gpsMarkerInstance = (position) => {
  var ll = L.latLng(position[0], position[1]);
  const icon = L.divIcon({
    className: "gps-icon",
    html: "<i class='fas fa-male fa-5x' style='color:blue;'></i>",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
  // const icon = gpsIcon();
  var marker = L.marker(ll, { icon });
  return marker;
};

const markerInstance = (position) => {
  var ll = L.latLng(position[0], position[1]);
  const icon = divIcon();
  var marker = L.marker(ll, { icon });
  const className = ".my-icon";
  marker.on("add", () => {
    circleAnimation(className);
    setInterval(() => {
      circleAnimation(className);
    }, 3000);
  });

  return marker;
};

const gpsMarker = () => {};
const addMarkerWithPopup = (toolTipText, position, videoTitle, embedId) => {
  const marker = markerInstance(position);
  var popuphtml = `<div >
        <p>${videoTitle}</p>
        <iframe
            src=https://www.youtube.com/embed/${embedId}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;showinfo=0"
            allowFullScreen
            width= 300
            height=200
            title=${videoTitle}
        />
    </div>`;

  marker.bindTooltip(toolTipText);
  marker.bindPopup(popuphtml);
  marker.addTo(map);
};

// Max Button
const addMaxButton = () => {
  map.addControl(
    new L.Control.Fullscreen({
      title: {
        false: "View Fullscreen",
        true: "Exit Fullscreen",
      },
      position: "bottomright",
    })
  );
};

// change layer button
const styleOptionsRender = () =>
  Object.keys(mapStyles)
    .map(
      (item) =>
        `<a class="dropdown-item options" href="#" data-id = ${item} >${mapStyles[item]}</a>`
    )
    .join("");

const changeLayerButton = (position) => {
  var layerButton = L.control({ position });
  layerButton.onAdd = () => {
    var div = L.DomUtil.create("div", "layer-icon");
    div.style.padding = "5px";
    div.style.cursor = "pointer";
    div.innerHTML = `<div class="btn-group">
      <i class="fas fa-bars fa-2x" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding:5px 7px; background-color:white; border-radius:2px"></i>
      <div class="dropdown-menu">
        ${styleOptionsRender()}
      </div>
    </div>`;
    layerButtonOpen = !layerButtonOpen;

    return div;
  };
  layerButton.addTo(map);
};

const setAttributes = (el, attrs) =>
  Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));

const attribs = {
  type: "range",
  min: 0,
  max: 1,
  step: 0.1,
  value: 1,
  orient: "vertical",
};

const addSliderControl = () => {
  var slider = L.control({ position: "topright" });
  slider.onAdd = () => {
    var input = L.DomUtil.create("input", "slider");

    setAttributes(input, attribs);
    input.style.margin = "20px";

    input.addEventListener("input", (e) => {
      map.dragging.disable();
      let val = e.target.value;
      layer.setOpacity(val);
      map.dragging.enable();
    });

    return input;
  };
  slider.addTo(map);
};

const main = () => {
  const logoPosition = "bottomleft";
  const logoPath =
    "http://beta.maraplot.com/wp-content/themes/meraplot/assets/img/mara-plot-logo.png";
  const logoClassName = "myclass";
  const logoWidth = 100;
  const gpsIconPosition = "bottomright";
  const layerPOsition = "topleft";
  const videoTitle = "Google Year In Search";
  const embeddId = "rokGy0huYEA";
  const toolTipText = "Google Year In Search Video";

  addLogo(logoPosition, logoPath, logoClassName, logoWidth);
  addZoom();
  addMaxButton();
  changeLayerButton(layerPOsition);
  layerChangeEvent();
  addMarkerWithPopup(toolTipText, markerPosition, videoTitle, embeddId);
  addGpsLogo(gpsIconPosition);
  addSliderControl();
};

main();
