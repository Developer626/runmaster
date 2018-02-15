import { View, $at } from './view'
import runMaster from './runmaster.class'
import { Application } from './view'
import { PaceGauge } from './screen-pace-gauge'

const $ = $at( '#HRScreen' );

export class HRScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screenhrdom = new screenHRDOM();
    paceGauge = new PaceGauge();
    
    onMount(){
      this.insert(this.paceGauge);
    }

    onRender() {
        this.screenhrdom.render( runMaster );
        this.paceGauge.setGauges();
    }

    onUnmount(){
    }
}

class screenHRDOM {
    
    hr = $ ( '#HR' );

    render( rm ) {
      this.hr.text = rm.getCurrentHR();
      
    }
}
