import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'

const $ = $at( '#PaceScreen' );

export class PaceScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screenpacedom = new screenPaceDOM();
    
    onMount(){
    }

    onRender(){
        this.screenpacedom.render( runMaster );
    }

    onUnmount(){
    }
}

class screenPaceDOM {
    
    currentPace = $ ( '#pace' );
    paceunit1 = $ ( '#paceunit1' );
    paceunit2 = $ ( '#paceunit2' );
    unit1="m/";
    unit2="km";
    

    render( rm ) {
      this.currentPace.text = rm.getCurrentPace();
      this.paceunit1.text = rm.getPaceUnit1();
      this.paceunit2.text = rm.getPaceUnit2();
      
    }
}
