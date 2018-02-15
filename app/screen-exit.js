import { View, $at } from './view'
import { Application } from './view'
import runMaster from './runmaster.class';

const $ = $at( '#ExitScreen' );

export class ExitScreen extends View {
    el = $();

    btnYes = $( '#btn-yes' );
    btnNo = $( '#btn-no' );

    onMount(){
        this.btnYes.onclick = () => Application.instance.exitApp();
        this.btnNo.onclick = ()  => 
        {
              var currentScreen='';
              if ((runMaster.started=='Y')||(runMaster.started=='P')) { currentScreen=Application.instance.statScreens[Application.instance.currentStatScreen] } else
              if (runMaster.started=='E') { currentScreen='SummaryScreen'; } else { currentScreen='EntryScreen'; }
               Application.switchTo( currentScreen ); 

        }

    }    
}