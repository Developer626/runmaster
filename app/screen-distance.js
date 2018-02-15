import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'
import { PaceGauge } from './screen-pace-gauge'

const $ = $at( '#DistanceScreen' );

export class DistanceScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screendistancedom = new screenDistanceDOM();
    paceGauge = new PaceGauge();
    
    onMount(){
      this.insert(this.paceGauge);
    }

    onRender() {
        this.screendistancedom.render( runMaster );
        this.paceGauge.setGauges();
    }

    onUnmount(){
    }
}

class screenDistanceDOM {
    
    distanceInt = $ ( '#distanceint' );
    distanceFrac = $ ( '#distancefrac');
    distanceunit = $ ( '#distanceunit' );    

    render( rm ) {
      this.distanceInt.text = rm.getDistanceInt();
      this.distanceFrac.text = rm.getDistanceFrac();
      this.distanceunit.text = rm.getDistanceUnit();  
    }
}
