import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'

const $ = $at( '#AveragePaceScreen' );

export class AveragePaceScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screenaveragepacedom = new screenAveragePaceDOM();
    
    onMount(){
    }

    onRender(){
        this.screenaveragepacedom.render( runMaster );
    }

    onUnmount(){
    }
}

class screenAveragePaceDOM {
    
    averagePace = $ ( '#averagepace' );
    paceunit1 = $ ( '#averagepaceunit1' );
    paceunit2 = $ ( '#averagepaceunit2' );
    unit1="m/";
    unit2="km";
    

    render( rm ) {
      this.averagePace.text = rm.getAveragePace();
      this.paceunit1.text = rm.getPaceUnit1();
      this.paceunit2.text = rm.getPaceUnit2();
      
    }
}
