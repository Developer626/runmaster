import { View, $at } from './view'
import runMaster from './runmaster.class';
import { Application } from './view'

const $ = $at( '#EndRunScreen' );

export class EndRunScreen extends View {
    el = $();

    btnYes = $( '#btn-yes' );
    btnNo = $( '#btn-no' );

    onMount(){
        this.btnYes.onclick = () => { runMaster.stop(); Application.switchTo( 'SummaryScreen' ); }
        this.btnNo.onclick = ()  => Application.switchTo( Application.instance.statScreens[Application.instance.currentStatScreen] ); 
    }    
}