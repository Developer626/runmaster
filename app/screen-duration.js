import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'

const $ = $at( '#DurationScreen' );

export class DurationScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screendurationdom = new screenDurationDOM();
    
    onMount(){
    }

    onRender(){
        this.screendurationdom.render( runMaster );
    }

    onUnmount(){
    }
}

class screenDurationDOM {
    
    duration = $ ( '#duration' );
    
    render( rm ) {
      this.duration.text = rm.getFormattedDuration();      
    }
}
