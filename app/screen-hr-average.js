import { View, $at } from './view'
import runMaster from './runmaster.class'
import { Application } from './view'
import { PaceGauge } from './screen-pace-gauge'

const $ = $at( '#AverageHRScreen' );

export class AverageHRScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screenaveragehrdom = new averageScreenHRDOM();
    paceGauge = new PaceGauge();
    
    onMount(){
      this.insert(this.paceGauge);
    }

    onRender() {
        this.screenaveragehrdom.render( runMaster );
        this.paceGauge.setGauges();
    }

    onUnmount(){
    }
}

class averageScreenHRDOM {
    
    averagehr = $ ( '#averageHR' );

    render( rm ) {
      this.averagehr.text = rm.getAverageHR();
      
    }
}
