import { HeartRateSensor } from "heart-rate";
import { geolocation } from "geolocation";
import { Barometer } from "barometer";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { today } from "user-activity";
import { Application } from './view'
import { battery } from "power";
import clock from "clock";
import { display } from "display";

class runMaster {
  // do i need to look at KalmanJS????????
    
  //heart rate
  hrm=0;                                // reference to the sensor object
  currentHR=0;                          // current hr reading
  maxHR=0;                              // max HR recorded
  totalHR=0;                            // summary of all HR readings
  countHR=0;                            // count of HR readings taken
  targetMinHR=130;                      // target minimum heartrate for session
  targetMaxHR=160;                      // target maximum heartrate for session
  
  //cadence
  targetSPM=0;                          // object used for setting the metronome -- 0 is off!!
  averageSPM=0;                         // number of steps
  lastSteps=-1;                         // last steps reading
  totalSteps=0;                         // activity total steps
  
  // activity duration
  lastTime=0;                           // previous time reading
  startTime=0;                          // activity start time
  endTime=0;                            // activity end time
  currentTime=0;                        // current time reading
  duration=0;                           // running time (not moving time i.e. time not paused or stopped)

  //distance
  distance=0;                           // calculate distance from GPS coordinates
  
  //gps
  gpsConnected=false;                   // has GPS sensor connected to the satellite network
  gpsWatchID=0;                         // reference to the geolocation watch position object
  currentHeading=0;                     // current heading
  lastLat=-999;                         // previous latitude
  lastLon=-999;                         // previous longitude
  lat=0;                                // current latitude
  lon=0;                                // current longitude
  gpsAccuracy=0;                        // current reading accuracy
  currentSpeed=0;                       // current speed
  lastDistance=0;                       // activity last distance
  currentDistance=0;                    // activity current distance

  //barometer
  bar=0;                                // reference to the barometer object
  lastpAltitude=false;                  // previous reading
  pAltitude=0;                          // current pressure
  totalpAscent=0;                       // total pressure ascent
  totalpDescent=0;                      // total pressure descent
  altitude=0;                           // current altitude
  lastAltitude=false                    // previous altitude
  totalAscent=0;                        // total ascent
  totalDescent=0;                       // total descent

  // pace
  targetPace=0                          // target pace for activity
  targetPaceUpperAlert=0;               // upper acceptable limit for activity
  targetPaceLowerAlert=0;               // lower acceptable limit for activity
  expectedDuration;                     // expected duration if current average pace is maintained
  
  //application
  started='N';                          // has the activity been started?
  readingNumber=0;                      // the number of gps readings taken (this is different to the number of recordings of data logged)
  sensorLogTimer=0;                     // reference to the timer object set to log the current readings
  sensorReadTimeMS=1000;                // number of milliseconds
  earthRadius=6371.008;                 // earth radius is km

  screenRendering() {
      clock.granularity = "seconds";
      clock.ontick = (evt) => {
      this.refreshScreenData(evt);
    }
  }
  startSensors() {
      this.hrm=new HeartRateSensor();
      this.hrm.onreading = () => this.hrmbeat();
      geolocation.enableHighAccuracy=true;
      this.gpsWatchID = geolocation.watchPosition(this.gpsBeat,this.gpsError);
      this.hrm.start();
      this.bar = new Barometer({ frequency: 1 });
      this.bar.onreading = () => this.readBarometer();  
      this.bar.start();
//      display.autoOff = false;
//      display.on = true;
  }
  stopSensors() {
    this.hrm.stop();
    this.bar.stop();
    clearInterval(this.sensorLogTimer);
    geolocation.clearWatch(this.gpsWatchID);
    display.autoOff = true;
  }
  readBarometer() {
    this.altitude=this.altitudeFromPressure(this.bar.pressure / 100);
    if (this.lastAltitude===false) { this.lastAltitude=this.altitude; }
    if (this.started==='Y') {
      if (this.altitude>this.lastAltitude) {
        this.totalAscent+=(this.altitude-this.lastAltitude);
      } else {
        this.totalDescent+=(this.lastAltitude-this.altitude);
      }
    }
    this.lastAltitude=this.altitude;
  }
  start() {
    if (display.on === false) {
       display.poke();
       display.on = false;
    }
    this.lastSteps=today.local.steps;
    this.lastTime = this.currentTime = new Date();
    if (this.startTime===0) { this.startTime = new Date(); }
    this.sensorLogTimer=setInterval(() => this.logCurrentReadings(),this.sensorReadTimeMS);
    this.started='Y';
    console.log("Start Run Method");
  }
  pause() {
    this.started='P';
    clearInterval(this.sensorLogTimer);
    console.log("Pause Run Method");
  }
  stop() {
    this.started='E';
    console.log("Stop Run Method");
  }
  
  refreshScreenData = (evt) =>  {
    Application.instance.render();
  }
  // method to take the current heartrate reading
  hrmbeat() {
    this.countHR++;
    this.currentHR=this.hrm.heartRate;
    if (this.currentHR>this.maxHR) { this.maxHR=this.currentHR; }
    this.totalHR+=this.currentHR;
  }

  gpsBeat = position => {
    this.gpsConnected=true;
    this.lastLat=this.lat;
    this.lastLon=this.lon;
    this.lat=position.coords.latitude;
    this.lon=position.coords.longitude;
    this.gpsAccuracy=position.coords.accuracy;
    this.currentSpeed=position.coords.speed;
    this.currentHeading=position.coords.heading;
    this.readingNumber++;
  }

  gpsError = () => {
    console.log("GPS Error");
  }

  logCurrentReadings() {
    if (display.on === false) {
       display.poke();
       display.on = false;
    }
    this.currentTime = new Date();
    let newsteps=today.local.steps;
    if (this.started==='Y') {
      this.distance+=this.calcDistance(this.lastLat,this.lastLon,this.lat,this.lon); 
      this.duration+=this.currentTime-this.lastTime;
      this.totalSteps+=newsteps-this.lastSteps;
    }
    this.lastTime=this.currentTime;
    this.lastSteps=newsteps;
    this.averageSPM=this.totalSteps/(this.duration/1000);    
  }
  getClockDisplay() {
    return preferences.clockDisplay;
  }

  //***********************************************************
  //***** methods to return formatted data to each screen *****
  //***********************************************************
  getCurrentSteps() {
    return this.totalSteps;
  }
  getStartTime() {
    return this.startTime;
  }
  getEndTime() {
    return this.endTime;
  }
  getCurrentTime() {
    return this.currentTime;
  }
  getLat(decPlaces=2) {
    return this.lat.toFixed(decPlaces);
  }
  getLon(decPlaces=1) {
    return this.lon.toFixed(decPlaces);
  }
  getDuration() {
    return this.duration;
  }
  getAltitude(decPlaces=1) {
    return this.altitude.toFixed(decPlaces);
  }
  getTargetMinHR() {
    return this.targetMinHR;
  }
  getTargetMaxHR() {
    return this.targetMaxHR;
  }
  getAppStatus() {
    return this.started;
  }
  getCurrentSpeed(decPlaces=2) {
    return this.currentSpeed.toFixed(decPlaces);
  }
  getTargetSPM() {
    return this.targetSPM;
  }
  getAverageSPM() {
    return this.averageSPM;
  }
  getTotalSteps() {
    return this.totalSteps;
  }
  getCurrentHR() {
    return this.currentHR;
  }
  getFormattedStartTime() {
    return this.startTime;
  }
  getFormattedEndTime() {
    return this.endTime;
  }
  getFormattedCurrentTime() {
    return this.endTime;
  }
  getGPSConnected() {
    return this.GPSConnected;
  }
  getCurrentHeading(decPlaces=0) {
    return this.currentHeading.toFixed(decPlaces);
  }
  getStartLat(decPlaces=6) {
    return "Start Lat";
  }
  getStartLon(decPlaces=6) {
    return "Start Lon";
  }
  getEndLat(decPlaces=6) {
    return "End Lat";
  }
  getEndLon(decPlaces=6) {
    return "End Lon";
  }
  getGPSAccuracy(decPlaces=2) {
    return "GPS Accuracy";
  }
  getTotalAscent(decPlaces=2) {
    return this.totalAscent.toFixed(decPlaces);
  }
  getTotalDescent(decPlaces=2) {
    return this.totalDescent.toFixed(decPlaces);
  }
  getTargetPace() {
    return this.targetPace;
  }
  getTargetPaceUpperAlert() {
    return this.targetPaceUpperAlert;
  }
  getTargetPaceLowerAlert() {
    return this.targetPaceLowerAlert;
  }
  getExpectedDuration() {
    return this.expectedDuration;
  }
  getReadingNumber() {
    return this.readingNumber;
  }
  getSensorReadTimeMS() {
    return this.ReadTimMS;
  }
  getEarthRadius() {
    return this.earthRadius;
  }
  getDistance(decPlaces=2) {
    if (units.distance==='us') {
      let retval=(this.distance/1609.34);
    } else {
      let retval=(this.distance/1000);
    }
    return retval.toFixed(decPlaces);
  }
  getBatteryLevel() { 
    return battery.chargeLevel;
  }
  getDistanceInt() {
    let retval=parseInt(this.getDistance());
    return isNaN( retval ) ? 0 : retval; 
  }
  getDistanceFrac() {
    let retval=this.getFrac(this.getDistance(),2); 
    return retval;
  }
  getDistanceUnit() {
    if (units.distance==='us') {
      let retval="mi";
    } else {
      let retval="km";
    }
    return retval;
  }
  // method to return the average heartrate recorded
  getAverageHR() {
    let retval=0;
    if (this.countHR>0) { retval=parseInt(this.totalHR/this.countHR) }
    return retval;
  }
  getMaxHR() {
    return this.maxHR;;
  }
  getFrac(num,toDec) {
    let retval=String(""+Number(num%1).toFixed(toDec)).split('.');
    return retval[1];
  }
  getCurrentPace() {
      let retval="";
      let pace=60/((this.getCurrentSpeed()*60*60)/1000);
      if (units.distance==="us") {
        pace=pace*1.60934;
      }
      let hr=parseInt(pace/60);
      let min=parseInt(pace-(hr*60));
      let sec=parseInt((pace%1)*60);

      min=this.zeroPad(min);
      sec=this.zeroPad(sec);
      if (this.getCurrentSpeed()==0) { retval="0:00"; } else {
        retval=min+":"+sec;      
      }
      return retval;
  }
  getAveragePace() {
      let retval="";
      let pace=60/((this.distance/(this.duration/1000)*60*60)/1000);
      if (units.distance==="us") {
        pace=pace*1.60934;
      }
      let hr=parseInt(pace/60);
      let min=parseInt(pace-(hr*60));
      let sec=this.zeroPad(parseInt((pace%1)*60));

      if ((this.distance==0)||(this.duration==0)) { retval="0:00"; } else {
        retval=min+":"+sec;  
      }
      
      return retval;
  }
  getFormattedDuration() {
      let min=parseInt(this.duration/60000);
      let sec=parseInt((this.duration/1000)%60);
      sec=this.zeroPad(sec);

      let retval="0:00";
      retval=min+":"+sec;
      return retval;
  }
  getPaceUnit1() {    
    return "m/";
  }
  getPaceUnit2() {
      let retVal="km";
      if (units.distance==="us") { retVal="mi"; } 
      return retVal;
  }
  getEarthRadius() {
    return this.earthRadius;
  }

  //*********************************************************
  //***** helper functions required for the application *****
  //*********************************************************
  zeroPad(num) {
    if (num<10) { return "0"+num;}
    return num;
  }
  altitudeFromPressure(pressure) {
    return (1 - (pressure/1013.25)**0.190284)*145366.45*0.3048;
  }
  // get distance between two coords
  calcDistance(lat1,lon1,lat2,lon2) {
    var R = this.getEarthRadius(); // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c * 1000; // Distance in metres
    if (d>1000) { d=0; }
    return d;
  }
  deg2rad(deg) {
    
    return deg * (Math.PI/180);
  }
}
export default new runMaster();