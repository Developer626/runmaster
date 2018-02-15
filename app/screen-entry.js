import { View, $at } from './view'
import { vibration } from "haptics";
import runMaster from './runmaster.class';
import { Application } from './view'

// Create the root selector for the view...
const $ = $at( '#EntryScreen' );

export class EntryScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();
    cadenceTimer=0;

    startButton = $( '#startrun' );
    pauseButton = $( '#pauserun' );
    stopButton = $( '#stoprun' );
  
    entryscreendom = new entryScreenDOM();

    // Lifecycle hook executed on `view.mount()`.
    onMount(){
        // TODO: insert subviews...
        // TODO: subscribe for events...
        this.cadenceTimer=setInterval(() => this.timerEvent(),60*1000/runMaster.getTargetSPM());
        this.startButton.onclick = () => { runMaster.start(); this.startButton.style.display="none"; this.pauseButton.style.display="inline"; Application.switchTo( 'DistanceScreen' ); }
        this.pauseButton.onclick = () => { runMaster.pause(); this.startButton.style.display="inline"; this.pauseButton.style.display="none"; }
        this.stopButton.onclick = () => runMaster.stop();
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount(){
        clearInterval(this.cadenceTimer);
        // TODO: unsubscribe from events...
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender(){
        // TODO: put DOM manipulations here...
        // Call this.render() to update UI.
        this.entryscreendom.render( runMaster );         
    }

    timerEvent() {
      vibration.start("bump");
    }
}

// Elements group. Used to group the DOM elements and their update logic together.
class entryScreenDOM {
    startButton = $( '#startrun' );
    lat = $( '#lat' );
    lon = $( '#lon' );
    altitude = $( '#alt' );
    hrmread = $( '#curHR' );
    currentSpeed = $ ( '#SPD' );
    currentHeading = $ ( '#HD' );
    currentDistance = $ ( '#distance' );
    distanceUnit = $ ( '#distanceunit' );
    ascent = $ ( '#ascent' );
    descent = $ ( '#descent' );
    maxHR = $ ( '#maxHR' );
    avgHR = $ ( '#avgHR' );
    targetCadence = $ ( '#targetCadence' );
    avgCadence = $ ( '#avgCadence' );
    totalsteps = $ ( '#totalSteps' );
    duration = $ ( '#duration' );
    startTime = $ ( '#startTime' );
    endTime = $ ( '#endTime' );
    currentTime = $ ( '#currentTime' );
    connected1 = $ ( '#connected1' );
    connected2 = $ ( '#connected2' );

    render( rm ) {
      if (rm.gpsConnected) { this.startButton.style.display='inline'; this.connected1.text="LINKED TO"; this.connected1.style.fill='fb-green'; this.connected2.style.fill='fb-green'; }
      this.lat.text = rm.getLat(6);
      this.lon.text = rm.getLon(6);
      this.altitude.text = rm.getAltitude();
      this.hrmread.text = rm.getCurrentHR();
      this.currentSpeed.text = rm.getCurrentSpeed();
      this.currentHeading.text = rm.getCurrentHeading();
      this.currentDistance.text = rm.getDistance(2);
      this.distanceUnit.text = rm.getDistanceUnit();
      this.ascent.text = rm.getTotalAscent(2);
      this.descent.text = rm.getTotalDescent(2);
      this.maxHR.text = rm.getMaxHR();
      this.avgHR.text = rm.getAverageHR();
      this.targetCadence.text = rm.getTargetSPM();
      this.avgCadence.text = rm.getAverageSPM(2);
      this.totalsteps.text = rm.getTotalSteps();
      this.duration.text = rm.getDuration();
      this.startTime.text = rm.getStartTime();
      this.endTime.text = rm.getEndTime();
      this.currentTime.text = rm.getCurrentTime();
    }
}
