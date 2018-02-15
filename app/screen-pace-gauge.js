import { View, $at } from './view'
import runMaster from './runmaster.class'
import { Application } from './view'

const $ = $at( '#PaceGauge' );

export class PaceGauge extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    pacegaugedom = new paceGaugeDOM();
    
    onMount(){
    }

    onRender(){
        //this.pacegaugedom.render( runMaster );
    }

    onUnmount(){
    }

    setGauges() {
      this.pacegaugedom.setGauges( runMaster );
    }
}

class paceGaugeDOM {
    paceindicator         =  $ ( '#pace-indicator' );
    hrindicator           =  $ ( '#hr-indicator' );
    paceactivityaverage   =  $ ( '#pace-activity-avg' );
    pacefiveminuteaverage =  $ ( '#pace-five-min-avg' );
    hractivityaverage     =  $ ( '#hr-activity-avg' );
    hrfiveminuteaverage   =  $ ( '#hr-five-min-avg' );
  
    render( rm ) {
      
    }

    setGauges( rm ) {
      this.paceindicator.x=this.calculateGaugePosition(2,1,4,6,10);
      this.paceactivityaverage.x=this.calculateGaugePosition(8,1,4,6,10);
      this.pacefiveminuteaverage.x=this.calculateGaugePosition(5,1,4,6,10);
      this.hrindicator.x=this.calculateGaugePosition(rm.getCurrentHR(),40,rm.getTargetMinHR(),rm.getTargetMaxHR(),220);
      this.hractivityaverage.x=this.calculateGaugePosition(rm.getAverageHR(),40,rm.getTargetMinHR(),rm.getTargetMaxHR(),220);
      this.hrfiveminuteaverage.x=this.calculateGaugePosition(rm.getAverageHR(),40,rm.getTargetMinHR(),rm.getTargetMaxHR(),220);
    }

    calculateGaugePosition(value,minValue,minTarget,maxTarget,maxValue) {
      let x1=3; let x2=120; let x3=226; let x4=346; // these are the gauge settings layout positions
      let position=0;
      
      if (value<minValue) {
        position=x1;
      } else if ((value>=minValue) && (value<minTarget)) {
        position=parseInt(((value-minValue)/(minTarget-minValue)*(x2-x1))+x1);
      } else if ((value>=minTarget)&&(value<=maxTarget)) {

        position=parseInt(((value-minTarget)/(maxTarget-minTarget)*(x3-x2))+x2);
      } else if ((value>maxTarget)&&(value<=maxValue)) {
        position=parseInt(((value-maxTarget)/(maxValue-maxTarget)*(x4-x3))+x3);
      } else {
        position=x4;
      }
      return position;      
    }

}
