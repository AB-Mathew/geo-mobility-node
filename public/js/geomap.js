function fileUpload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("file");
    console.log("fileupload:" + fileUpload.value);
    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    //if (regex.test(fileUpload.value.toLowerCase())) {
    if(fileUpload.value.toLowerCase().includes('xls') || fileUpload.value.toLowerCase().includes('xlsx')){
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    }
    else if(fileUpload.value.toLowerCase().includes('csv')){
        var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    processCSV(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } 
       
        // start reading the file. When it is done, calls the onload event defined above.
        
    }
    else if(fileUpload.value.toLowerCase().includes('kml')){
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
            processKML(e.target.result);
        };
        fileReader.readAsText(fileUpload.files[0]);
        
    }
    else if(fileUpload.value.toLowerCase().includes('xml')){
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
            processXML(e.target.result);
        };
        fileReader.readAsText(fileUpload.files[0]);
    }
    else{
        alert("please upload valid Excel, CSV or KML file!");
    }
};
var excelRows = '';
function ProcessExcel(data) {
    //Read the Excel File data.
    console.log("processing excel file!");
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log("excelrow.length:" + excelRows.length);

    for (var i = 0; i < excelRows.length; i++) {
        
        var radius = excelRows[i].Radius;
        console.log("radius:" + radius);  
        var latitude = excelRows[i].Latitude; 
        var longitude = excelRows[i].Longitude;
        var city = excelRows[i].City;
        var address = excelRows[i].Address;
        
        var marker_94355a315db8450e844fa2fd270349c5 = L.marker(
        [latitude, longitude],
        {}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    var marker_94355a315db8450e844fa2fd270349c5 = L.circle(
        [latitude, longitude],{color: "red", opacity:5, radius: radius}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    var text = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'text'
    })
    .setContent("CT " + [i+1])
    .setLatLng([latitude, longitude]);
    text.addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    var popup_00d6f466a00a48c58464c600a627aab3 = L.popup({"maxWidth": "100%"});

    //to write place name
    var html_c8b3feb843db42d28eb7a70f72fe6f1f = $(`<div id="html_c8b3feb843db42d28eb7a70f72fe6f1f" style="width: 100.0%; height: 100.0%;">`+city +` ` +address+`</div>`)[0];
    popup_00d6f466a00a48c58464c600a627aab3.setContent(html_c8b3feb843db42d28eb7a70f72fe6f1f);
    

    marker_94355a315db8450e844fa2fd270349c5.bindPopup(popup_00d6f466a00a48c58464c600a627aab3);

        // marker_94355a315db8450e844fa2fd270349c5.bindTooltip(
        //     `<div>
        //          CT `+[i+1]+`
        //      </div>`,
        //     {"sticky": true}
        // );
    }
    alert("File uploaded successsfully!");
    var oldInput = document.getElementById("file");   
    var newInput = document.createElement("input"); 
    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    oldInput.parentNode.replaceChild(newInput, oldInput); 
    //Create a HTML Table element.
    /*
    var table = document.createElement("table");
    table.border = "1";

    //Add the header row.
    var row = table.insertRow(-1);

    //Add the header cells.
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Radius";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Longitude";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Latitude";
    row.appendChild(headerCell);

    //Add the data rows from Excel file.
    for (var i = 0; i < excelRows.length; i++) {
        //Add the data row.
        var row = table.insertRow(-1);

        //Add the data cells.
        var cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Radius;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Longitude;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Latitude;
    }

    var dvExcel = document.getElementById("dvExcel");
    dvExcel.innerHTML = "";
    dvExcel.appendChild(table); */
};
function processCSV(data){
    console.log("In processcSV..");
    var allTextLines = data.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
   //console.log("entries length:" + entries.length);
   var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
 
    for (var i = 0; i < lines.length; i++) {
    
        var radius = lines[i][0];  
        
        var latitude = lines[i][1]; 
        var longitude = lines[i][2];
        var city = lines[i][3];
        var address = lines[i][4];
        
        var marker_94355a315db8450e844fa2fd270349c5 = L.marker(
        [latitude, longitude],
        
        {}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    
    var marker_94355a315db8450e844fa2fd270349c5 = L.circle(
        [latitude, longitude],{color: "red", opacity:5, radius: radius}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    var text = L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'text'
    })
    .setContent("CT " + [i+1])
    .setLatLng([latitude, longitude]);
    text.addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    var popup_00d6f466a00a48c58464c600a627aab3 = L.popup({"maxWidth": "100%"});

    //to write place name
    var html_c8b3feb843db42d28eb7a70f72fe6f1f = $(`<div id="html_c8b3feb843db42d28eb7a70f72fe6f1f" style="width: 100.0%; height: 100.0%;">`+city +` ` +address+`</div>`)[0];
    popup_00d6f466a00a48c58464c600a627aab3.setContent(html_c8b3feb843db42d28eb7a70f72fe6f1f);
    

    marker_94355a315db8450e844fa2fd270349c5.bindPopup(popup_00d6f466a00a48c58464c600a627aab3);

        // marker_94355a315db8450e844fa2fd270349c5.bindTooltip(
        //     `<div>
        //          click
        //      </div>`,
        //     {"sticky": true}
        // );
    }
    
    alert("File uploaded successsfully!");
    var oldInput = document.getElementById("file");   
    var newInput = document.createElement("input"); 
    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    oldInput.parentNode.replaceChild(newInput, oldInput); 
}
function processKML(data){
    console.log('In processKML');
    // fetch(data)
    // .then(res=>res.text())
    // .then(kmltext=>{
        const parser = new DOMParser();
        const kml = parser.parseFromString(data,'text/xml');
        const track = new L.KML(kml);
        map_3a00c3c1dba7409bb59f39457c7b4088.addLayer(track);

        const bounds = track.getBounds();
        map_3a00c3c1dba7409bb59f39457c7b4088.fitBounds(bounds);
    //});
}
function processXML(data){

console.log('IN processXML');
    var parser = new DOMParser();
    var xmldata = parser.parseFromString(data, "text/xml");
    var latlongArray = [];
    var flag = "false";
    console.log(xmldata);

    //console.log('Attribute length:' + xmldata.getElementsByTagName("xn:VsDataContainer").length);

    var cellIdList = [];
    for (var i = 0; i < xmldata.getElementsByTagName("xn:VsDataContainer").length; i++) {

        var mnc, mcc, eNBId, cellID;
        var longlat = [];
        if (xmldata.getElementsByTagName("es:eNBId")) {
            eNBId = xmldata.getElementsByTagName("es:eNBId")[0].textContent;
            console.log("enbid" + eNBId);
        }
        
        if (xmldata.getElementsByTagName("es:cellId")[i]) {
            cellID = xmldata.getElementsByTagName("es:cellId")[i].textContent;
            cellIdList.push(cellID);

        }
        
        if (xmldata.getElementsByTagName("es:eutranCellPolygon")[i]) {
            for (var j = 0; j < xmldata.getElementsByTagName("es:eutranCellPolygon").length; j++) {
                var lon = xmldata.getElementsByTagName("es:cornerLongitude")[j].textContent;
                var lat = xmldata.getElementsByTagName("es:cornerLatitude")[j].textContent;
             
                longlat.push([lat / 1000000, lon / 1000000]);
            }
        }


    }
    
    if (longlat != null) {
        var polygon = L.polygon(longlat, { color: 'red' }).bindTooltip("eNBId: " + eNBId).addTo(map_3a00c3c1dba7409bb59f39457c7b4088);
        //zoom the map to the polygon
        map_3a00c3c1dba7409bb59f39457c7b4088.fitBounds(polygon.getBounds());
    }
    latlongArray = [];

    //old code for different xml format file
    // console.log('IN processXML');
    // var parser = new DOMParser();
    // var xmldata = parser.parseFromString(data,"text/xml");
    // var latlongArray=[];
    // var flag = "false";
    
    // for(var i=0;i<xmldata.getElementsByTagName("xn:VsDataContainer").length;i++){
    //     console.log('Attribute length:' + xmldata.getElementsByTagName("xn:VsDataContainer").length);

    //     var mnc,mcc,eNBId,cellID;
    //     if(flag=="false"){
    //         if(xmldata.getElementsByTagName("es:mnc")){
    //             mnc = xmldata.getElementsByTagName("es:mnc")[i].textContent;
    //         }
    //         if(xmldata.getElementsByTagName("es:mcc")){
    //             mcc = xmldata.getElementsByTagName("es:mcc")[i].textContent;
    //         }
    //         if(xmldata.getElementsByTagName("es:eNBId")){
    //             eNBId = xmldata.getElementsByTagName("es:eNBId")[i].textContent;
    //         }
    //         if(xmldata.getElementsByTagName("es:cellId")){
    //             cellID = xmldata.getElementsByTagName("es:cellId")[i].textContent;
    //         }
    //         flag="true";
    //     }
    //     else{
    //         for(var j =0; j<xmldata.getElementsByTagName("es:eutranCellPolygon").length;j++){
    //             var lon = xmldata.getElementsByTagName("es:cornerLongitude")[j].textContent; 
    //             var lat = xmldata.getElementsByTagName("es:cornerLatitude")[j].textContent; 
    //             latlongArray.push({"lat" : lat,"long" : lon});
    //         }
    //         flag="false";
    //     } 
    // }
    // console.log('mnc:' + mnc + '::mcc:' + mcc + '::eNBId:' + eNBId + '::cellID:' + cellID); 
    // console.log('latlan length:' + latlongArray.length);
    // var latlong = '';
    // for (var k=0;k<latlongArray.length;k++) {
    //     latlong += '[' + latlongArray[k].lat/1000000 + ',' + latlongArray[k].long/1000000 + '],';
    // }
    // latlong = latlong.slice(0, -1);

    // console.log('latlong::' + latlong);

    // if(latlong !== null || latlong.length > 0 || latlong !== ''){
    // var polygon = L.polygon([ latlong ], {color: 'red'}).addTo(map_3a00c3c1dba7409bb59f39457c7b4088);

    // //zoom the map to the polygon
    // map_3a00c3c1dba7409bb59f39457c7b4088.fitBounds(polygon.getBounds());
        
    // }
     
}
    //set the location and put map in center of that location
    var map_3a00c3c1dba7409bb59f39457c7b4088 = L.map(
        "map_3a00c3c1dba7409bb59f39457c7b4088",
        {
            center: [43.640497438, -79.3749985],
            crs: L.CRS.EPSG3857,
            zoom: 17,
            zoomControl: true,
            preferCanvas: false,
        }
    );
    var tile_layer_a1748ba6ab304d51b1712aa460985ecd = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {"attribution": "Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
    ).addTo(map_3a00c3c1dba7409bb59f39457c7b4088);
       
    var options = {
      position: "topleft",
      draw: {},
      edit: {},
    }
    // FeatureGroup is to store editable layers.
    var drawnItems = new L.featureGroup().addTo(
        map_3a00c3c1dba7409bb59f39457c7b4088
    );
    options.edit.featureGroup = drawnItems;
    var draw_control_2ddb5afec6f943c3b62b77782bd1aef2 = new L.Control.Draw(
        options
    ).addTo( map_3a00c3c1dba7409bb59f39457c7b4088 );
    map_3a00c3c1dba7409bb59f39457c7b4088.on(L.Draw.Event.CREATED, function(e) {
        var layer = e.layer,
            type = e.layerType;
        var coords = JSON.stringify(layer.toGeoJSON());
        
        layer.on('click', function() {
            alert(coords);
            console.log(coords);
        });
        drawnItems.addLayer(layer);
     });
    map_3a00c3c1dba7409bb59f39457c7b4088.on('draw:created', function(e) {
        drawnItems.addLayer(e.layer);
    });
        
        // document.getElementById('export').onclick = function(e) {
        //     var data = drawnItems.toGeoJSON();
        //     var convertedData = 'text/json;charset=utf-8,'
        //         + encodeURIComponent(JSON.stringify(data));
        //     document.getElementById('export').setAttribute(
        //         'href', 'data:' + convertedData
        //     );
        //     document.getElementById('export').setAttribute(
        //         'download', "data.geojson"
        //     );
        // }
    //add data from file(will be replaced with to display data from database)
    var feature_group_55109f0eeb9d4053aa79dcf3dd2029b0 = L.featureGroup(
        {}
    ).addTo(map_3a00c3c1dba7409bb59f39457c7b4088);

    var marker_1fae538da1da49e2911eaa271418a9b2 = L.marker(
        [43.8828, -79.4403],
        {}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
   
    var popup_6479ab6e7fc248998bd9d92b5d5ff4c6 = L.popup({"maxWidth": "100%"});

    //to write place name
    var html_09e81aabdbbf48bdb2ed76e4f4ee95b6 = $(`<div id="html_09e81aabdbbf48bdb2ed76e4f4ee95b6" style="width: 100.0%; height: 100.0%;">8675 Yonge St, Richmond Hill, ON</div>`)[0];
    popup_6479ab6e7fc248998bd9d92b5d5ff4c6.setContent(html_09e81aabdbbf48bdb2ed76e4f4ee95b6);

    marker_1fae538da1da49e2911eaa271418a9b2.bindPopup(popup_6479ab6e7fc248998bd9d92b5d5ff4c6);
    // marker_1fae538da1da49e2911eaa271418a9b2.bindTooltip(
    //     `<div>
    //          CT 00
    //      </div>`,
    //     {"sticky": true}
    // );

    // var latlang = [[48.428609,-89.228876],[48.433050,-89.228318],[48.433887,-89.229992],[48.433329,-89.231945],[48.434166,-89.233597],[48.435550,-89.233876],[48.435550,-89.235828],[48.434724,-89.236386],[48.432782,-89.235271],[48.432503,-89.237481],[48.430551,-89.238039],[48.429724,-89.236944],[48.428888,-89.234434],[48.428609,-89.228876]];
    // var marker_94355a315db8450e844fa2fd270349c5 = L.polygon(
    //     //[48428609,-89228876],[48433050,-89228318],[48433887,-89229992],[48433329,-89231945],[48434166,-89233597],[48435550,-89233876],[48435550,-89235828],[48434724,-89236386],[48432782,-89235271],[48432503,-89237481],[48430551,-89238039],[48429724,-89236944],[48428888,-89234434],[48428609,-89228876]
    //     latlang
    // ,{color: "red", opacity:5}).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    
    var marker_94355a315db8450e844fa2fd270349c5 = L.marker(
        [43.6453, -79.3806],
        {}
    ).addTo(feature_group_55109f0eeb9d4053aa79dcf3dd2029b0);
    
    var popup_00d6f466a00a48c58464c600a627aab3 = L.popup({"maxWidth": "100%"});

    //to write place name
    var html_c8b3feb843db42d28eb7a70f72fe6f1f = $(`<div id="html_c8b3feb843db42d28eb7a70f72fe6f1f" style="width: 100.0%; height: 100.0%;">141 Bay St, Toronto, ON</div>`)[0];
    popup_00d6f466a00a48c58464c600a627aab3.setContent(html_c8b3feb843db42d28eb7a70f72fe6f1f);

    marker_94355a315db8450e844fa2fd270349c5.bindPopup(popup_00d6f466a00a48c58464c600a627aab3)
    ;
    marker_94355a315db8450e844fa2fd270349c5.bindTooltip(
        `<div>
             CT 01
         </div>`,
        {"sticky": true}
    );   
    //search functionality
    var feature_group_55109f0eeb9d4053aa79dcf3dd2029b0searchControl = new L.Control.Search({
        layer: feature_group_55109f0eeb9d4053aa79dcf3dd2029b0,
        
        collapsed: false,
        textPlaceholder: 'Search',
        position:'topleft',                
    
        initial: false,
        
        hideMarkerOnCollapse: true 
    });
    feature_group_55109f0eeb9d4053aa79dcf3dd2029b0searchControl.on('search:locationfound', function(e) {
        feature_group_55109f0eeb9d4053aa79dcf3dd2029b0.setStyle(function(feature){
            return feature.properties.style
        })
        
        if(e.layer._popup)
            e.layer.openPopup();
    })
    feature_group_55109f0eeb9d4053aa79dcf3dd2029b0searchControl.on('search:collapsed', function(e) {
            feature_group_55109f0eeb9d4053aa79dcf3dd2029b0.setStyle(function(feature){
                return feature.properties.style
        });
    });
    map_3a00c3c1dba7409bb59f39457c7b4088.addControl( feature_group_55109f0eeb9d4053aa79dcf3dd2029b0searchControl );
        
