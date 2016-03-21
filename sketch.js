/*
@ name: Wind Bubbles
@ description: Takes the wind degree / speed and maps a bunch of randomly generated bubbles. 
@ author: Nadine L.
*/

// start drawing in the middle of the screen
var y = window.innerHeight / 2;
var bubbles = []; 
var numToGen = 200;
var windSpeed;
var description;
var mainThing;
var temp;
var sunTime;
var cityName;
var windDeg;


function preload(){
	var url = 'http://api.openweathermap.org/data/2.5/weather?id=6167865&units=metric&APPID=ENTERYOUROWNAPPIDHERE'; // TO
	loadJSON(url,parseWeather);
}


function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	colorMode(RGB);
	frameRate(255);

	for (var i=0; i < random(60,numToGen); i++){
		bubbles.push(new Bubble());
	}
	console.log("bubbles length",bubbles.length);
	displayWeather();
}

function draw() {


	if(mainThing == "Clear"){
		background(8,71,89);
	}else if (mainThing == "Overcast" || mainThing == "Rain"){
		background(100);
	}else if(mainThing == "Snow"){
		background(220,232,235);
	}else {
		background(8,71,89);
	}
	
	

	for(var i=0; i<bubbles.length; i++){
		bubbles[i].update();
		bubbles[i].display(); // passwindSpeed
		
	}
	
}

function parseWeather(w){
	console.log("!parseWeather",w);
	cityName = w.name;
	description = w.weather[0].description;
	temp = w.main.temp;
	windSpeed = w.wind.speed * 3.6; // turn from mps to kph
	sunTime = w.sys.sunset;
	windDeg = w.wind.deg;
	mainThing = w.weather[0].main;

	console.log("parseWeather!",windSpeed,windDeg,temp,description,mainThing);
}

function displayWeather(){
	// http://www.wxforum.net/index.php?topic=5923.0
	// http://climate.umn.edu/snow_fence/components/winddirectionanddegreeswithouttable3.htm

	var windDir = "";

	if(windDeg >= 0 & windDeg < 11.25){
		// direct N = 0
		windDir = "N";
	} else if(windDeg > 11.25 & windDeg < 33.75){
		// direct NNE = 22.5
		windDir = "NNE";
	} else if(windDeg > 33.75 & windDeg < 56.25){
		// direct NE = 45
		windDir = "NE";
	}else if(windDeg > 56.25 & windDeg < 78.75){
		// direct ENE = 67.5
		windDir = "ENE";
	}else if(windDeg > 78.75 & windDeg < 101.25){
		//direct E = 90
		windDir = "E";
	}else if(windDeg > 101.25 & windDeg < 123.75){
		// direct ESE = 112.5
		windDir = "ESE";
	}else if(windDeg > 123.75 & windDeg < 146.25){
		// direct SE = 135;
		windDir = "SE";
	}else if(windDeg > 146.25 & windDeg < 168.75){
		// direct SSE = 157.5
		windDir = "SSE";
	}else if(windDeg > 168.75 & windDeg < 191.25){
		// direct south = 180
		windDir = "S";
	}else if(windDeg > 191.25 & windDeg < 213.75){
		// direct SSW = 202.5
		windDir = "SSW";
	}else if(windDeg > 213.75 & windDeg < 236.25){
		// direct SW = 225
		windDir = "SW";
	}else if(windDeg > 236.25 & windDeg < 258.75){
		// direct WSE = 247.5
		windDir = "WSW";
	}else if(windDeg > 258.75 & windDeg < 281.25){
		// direct W = 270
		windDir = "W";
	}else if(windDeg > 281.25 & windDeg < 303.75){
		// direct WNW = 292.5
		windDir = "WNW";
	}else if(windDeg > 303.75 & windDeg < 326.25){
		// direct NW = 315
		windDir = "NW";
	}else if(windDeg > 326.25 & windDeg < 348.75){
		// direct NNW = 337.5
		windDir = "NNW";
	}else if(windDeg > 348.75 & windDeg <= 360){
		// direct N = 360
		windDir = "N";
	}

	var containDiv = createDiv("");
	var cityDiv = createDiv(cityName);
	var temperatureDiv = createDiv(floor(temp) + '&deg;C');
  	var windDiv = createDiv("Wind: " + floor(windSpeed) + " <small>KPH</small> "+ windDir);
  	var mainDesc = createDiv(description);

  	containDiv.style("background: #fff; padding: 5px; height: 90px; width: 130px;");
  	containDiv.position(10,10);
  	cityDiv.position(20,20);
  	temperatureDiv.position(20,40);
  	windDiv.position(20,60);
  	mainDesc.position(20,80);
}

function Bubble(){
	this.dHigh = 300;
	this.speed = random(1,windSpeed);
	this.position = createVector(random(width),random(height))
	this.diameter = random(20,this.dHigh);

	this.r = (random(100,255));
	this.g = (random(100,255));
	this.b = (random(100,255));
	this.a = (random(100,255));

	this.colorPulse = true;

	this.update = function(){
		
		//console.log(temp);
  		if(this.r >= 254){
  			this.colorPulse = false;
  		}else if(this.r <=1){
  			this.colorPulse = true;
  		}

  		if(this.colorPulse){
  			this.r++;
  			this.g--;
  		}else if(!this.colorPulse){
  			this.r--;
  			this.g++;
  		}
  		
  		// south is given as 180 degrees
  		// east is given 90 degrees

  		var xCos = this.speed*cos(radians(windDeg+90));
		var ySin = this.speed*sin(radians(windDeg+90));
		//console.log(xCos,ySin);
		
    	this.position.y =  this.position.y + ySin; // sin
    	this.position.x = this.position.x + xCos; // -this.speed x cos
    	//console.log(ySin,this.position.y);
    	//console.log(xCos,this.position.x);
    	//console.log(this.speed);
		
		// if they go off the screen, reset (omg this annoyssss meeeeeee.)
		if(this.position.y < -300){ //500
			this.position.y = height+300;
		}

		if (this.position.y > height+300){
			this.position.y = -300;
		}
		

		if (this.position.x > width + 300){ // right side.
			this.position.x = -300;
		}
		if (this.position.x < -300){ //500
			this.position.x = width+300;
		}
		//console.log(this.position.x,this.position.y);

	}

	this.display = function(){

		var from = color(this.r, this.g, this.b,this.a);
		fill(from);
		noStroke();
    	ellipse(this.position.x, this.position.y, this.diameter, this.diameter);

	}

}
