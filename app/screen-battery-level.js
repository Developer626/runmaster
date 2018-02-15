import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'
import { PaceGauge } from './screen-pace-gauge'

const $ = $at( '#BatteryLevelScreen' );

export class BatteryLevelScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.
    curPos=354/2;

    // Element group.
    batteryleveldom = new batteryLevelDOM();
    paceGauge = new PaceGauge();
    
    onMount(){
      this.insert(this.paceGauge);
    }

    onRender(){
        this.batteryleveldom.render( runMaster );
        this.paceGauge.setGauges();
    }

    onUnmount(){
    }
}

class batteryLevelDOM {
    batteryLevel = $ ( '#batteryLevel' );

    render( rm ) {
      this.batteryLevel.text = rm.getBatteryLevel();
    }
}
