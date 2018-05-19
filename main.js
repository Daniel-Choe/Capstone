var customIcons = {
    };

function load() {
	var markers = [];
	
	var map = new google.maps.Map(document.getElementById("map"), {
		center: new google.maps.LatLng(39.166531, -86.528549),
		zoom: 15,
		mapTypeId: 'roadmap'
      		});
      		
	
	var passtypevalue = document.forms[0].passes.value;
	var distancevalue = document.forms[0].distance.value;
	var freevalue = document.forms[0].free.checked;
	var metersvalue = document.forms[0].meters.checked;
	var garagevalue = document.forms[0].garage.checked;
	var residentpassvalue = document.forms[0].residentpass.checked;
	
// Create the search box and link it to the UI element.
  var input = (document.getElementById('pac-input'));
  
  var searchBox = new google.maps.places.SearchBox((input));
  
  
  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
       
    if (places.length == 0) {
      return;
    }
    for (var i = 0; marker = markers[i]; i++) {
      marker.setMap(null);
    }
    
    // For each place, get the icon, place name, and location.  
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
       var pinColor = "000000";
       var pointColor = "FFFFFF";
       var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor +"|"+pointColor,
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34));

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,   
        title: place.name,
        position: place.geometry.location,
        icon: pinImage
      });
		markers.push(marker);   
		createMarker(markers[i]);  
    }
  });
  // [END region_getplaces]
  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
  
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
	
	var infoWindow = new google.maps.InfoWindow;
	// Change this depending on the name of your PHP file
	downloadUrl("form_action.php", 
	function(data) {
		var xml = data.responseXML;
        var markers = xml.documentElement.getElementsByTagName("marker");
        for (var i = 0; i < markers.length; i++) {        
        
        var spot = markers[i].getAttribute("SpotID");
        var type = markers[i].getAttribute("TypeOfPass");
        var free = markers[i].getAttribute("Free");
        var meter = markers[i].getAttribute("Meter");
        var garage = markers[i].getAttribute("Garage");
        var resident = markers[i].getAttribute("ResidentPass");
        var notes = String(markers[i].getAttribute("Notes"));
        
        if (passtypevalue==markers[i].getAttribute("TypeOfPass")){
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("Latitude")),
              parseFloat(markers[i].getAttribute("Longitude")));
          var html = "<b>" + spot + "</b> <br/>" + type;
          var pinLetter = passtypevalue;
          var pinColor = "C24641";
   		  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+pinLetter+"|" + pinColor,
        		new google.maps.Size(21, 34),
        		new google.maps.Point(0,0),
        		new google.maps.Point(10, 34));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: pinImage
          });
	bindInfoWindow(marker, map, infoWindow, html);
          }
        else if (freevalue==true && markers[i].getAttribute("Free")=="Yes"){
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("Latitude")),
              parseFloat(markers[i].getAttribute("Longitude")));
          var number = markers[i].getAttribute("NumberofSpots");
          var html = "<b>Number of Spots: " + number;
          var pinColor = "FFA500";
   		  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=F|" + pinColor,
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: pinImage
          });
	bindInfoWindow(marker, map, infoWindow, html);
          }
        else if (metersvalue==true && markers[i].getAttribute("Meter")=="Yes"){
          var rate = notes.slice(0,20);
          var daysmetered = notes.slice(20,61);
          var daysfree = notes.slice(62);   
          var number = markers[i].getAttribute("NumberofSpots");
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("Latitude")),
              parseFloat(markers[i].getAttribute("Longitude")));
          var html ="<b> Number of Spots: " + number + "</b> <br/>" + rate + "<br />" + daysmetered + "<br />" + daysfree;
          var pinColor = "85BB65";
   		  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=M|" + pinColor,
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: pinImage
          });
	bindInfoWindow(marker, map, infoWindow, html);
          }
        else if (garagevalue==true && markers[i].getAttribute("Garage")=="Yes"){
          var name = markers[i].getAttribute("Name");
          var timefree = markers[i].getAttribute("TimeFree");  
          var rates = String(markers[i].getAttribute("Rates"));
          var rates2 = rates.split(",");        
          var allrates=[];  
          for (var b = 0; b < rates2.length; b++) {
    		allrates+=rates2[b]+"<br/>";
			}      
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("Latitude")),
              parseFloat(markers[i].getAttribute("Longitude")));
          var html = "<b>" + name + "</b> <br/>Rates: <br />" + allrates + "Free: <br />" + timefree; 
          var icon = customIcons[type] || {};
          var pinColor = "357EC7";
   		  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=G|" + pinColor,
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: pinImage
          });
	bindInfoWindow(marker, map, infoWindow, html);
          }
        else if (residentpassvalue==true && markers[i].getAttribute("ResidentPass")=="Yes"){
          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("Latitude")),
              parseFloat(markers[i].getAttribute("Longitude")));
          var html = "<b>Zone: " + notes;
          var icon = customIcons[type] || {};
          var pinColor = "C38EC7";
   		  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+notes+"|" + pinColor,
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: pinImage
          });
	bindInfoWindow(marker, map, infoWindow, html);
          }
          }
        });
 
          // Start Geolocation
    if(navigator.geolocation) {    	
        navigator.geolocation.getCurrentPosition(function(position) {
        	document.getElementById('currentlocation').onclick = function() {
        	
        		var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
  	 		
  	 			var marker1 = new google.maps.Marker({
  	 				map:map,
  	 				position:pos,
  	 			});
  	 		
  	 			var html="<b>Current Location";
  	 		
  	 			bindInfoWindow(marker1,map,infoWindow,html);
  	 			var circle = new google.maps.Circle({
					radius: (402.34)/2, 
					center: pos,					
      				map:map,
      				fillOpacity: 0,
      				strokeOpacity: 0
				}); 
				map.fitBounds(circle.getBounds()); 
			};
			
            var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
            var marker2 = new google.maps.Marker({
  	 			map:map,
  	 			position:pos,
  	 			});
  	 		var html2="<b>Current Location";
  	 		
  	 		bindInfoWindow(marker2,map,infoWindow,html2);           
            
            if (distancevalue=="1/4 Mile"){
				var circle = new google.maps.Circle({
					radius: (402.34)/2, 
					center: pos,
					strokeColor: 'rgba(174,53,31,1)',
      				strokeOpacity: 0.8,
     				strokeWeight: 2,
      				fillColor: '#848482',
      				map:map,
      				fillOpacity: 0
				}); 
				map.fitBounds(circle.getBounds()); 
			}
			else if (distancevalue=="1/2 Mile"){
				var circle = new google.maps.Circle({
					radius: (804.67)/2, 
					center: pos,
					strokeColor: 'rgba(174,53,31,1)',
      				strokeOpacity: 0.8,
     				strokeWeight: 2,
      				fillColor: '#848482',
      				map:map,
      				fillOpacity: 0
				}); 
				map.fitBounds(circle.getBounds()); 
			}
			else if (distancevalue=="1 Mile"){
				var circle = new google.maps.Circle({
					radius: (1609.34)/2, 
					center: pos,
					strokeColor: 'rgba(174,53,31,1)',
      				strokeOpacity: 0.8,
     				strokeWeight: 2,
      				fillColor: '#848482',
      				map:map,
      				fillOpacity: 0
				}); 
				map.fitBounds(circle.getBounds()); 
			}
			else if (distancevalue=="2 Miles"){
				var circle = new google.maps.Circle({
					radius: (3218.69)/2, 
					center: pos,
					strokeColor: 'rgba(174,53,31,1)',
      				strokeOpacity: 0.8,
     				strokeWeight: 2,
      				fillColor: '#848482',
      				map:map,
      				fillOpacity: 0
				}); 
				map.fitBounds(circle.getBounds()); 
			}
			
			

        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

// Google Maps Error Flags

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindowLocation = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}


    
function bindInfoWindow(marker, map, infoWindow, html) {
	google.maps.event.addListener(marker, 'click', 
	function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
}

function downloadUrl(url, callback) {
	var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			request.onreadystatechange = doNothing;
			callback(request, request.status);
		}
	};
   
	request.open('GET', url, true);
	request.send(null);
    }


    function doNothing() {}