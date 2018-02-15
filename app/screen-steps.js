import { View, $at } from './view'
import clock from 'clock'
import runMaster from './runmaster.class'
import { Application } from './view'

const $ = $at( '#StepsScreen' );

export class StepsScreen extends View {
    // Root view element used to show/hide the view.
    el = $(); // Just the #ScreenDistance element.

    // Element group.
    screenstepsdom = new screenStepsDOM();
    
    onMount(){
    }

    onRender(){
        this.screenstepsdom.render( runMaster );
    }

    onUnmount(){
    }
}

class screenStepsDOM {
    
    currentSteps = $ ( '#steps' );
  
    render( rm ) {
      this.currentSteps.text = rm.getCurrentSteps();      
    }
}
