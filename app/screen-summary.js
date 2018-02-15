import { View, $at } from './view'
import runMaster from './runmaster.class';

// Create the root selector for the view...
const $ = $at( '#SummaryScreen' );

export class SummaryScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();
  
    summaryscreendom = new summaryScreenDOM();

    onMount(){
    }
    onUnmount(){
    }

    onRender(){
        this.summaryscreendom.render( runMaster )
    }

}

// Elements group. Used to group the DOM elements and their update logic together.
class summaryScreenDOM {
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
    
    // UI update method(s). Can have any name, it's just the pattern.
    // Element groups have no lifecycle hooks, thus all the data required for UI update
    // must be passed as arguments.
    render( rm ){
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
