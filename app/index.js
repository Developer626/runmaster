import document from "document";
import { battery } from "power";
import { Application } from './view'
import { DistanceScreen } from './screen-distance'
import { DurationScreen } from './screen-duration'
import { AverageHRScreen } from './screen-hr-average'
import { HRScreen } from './screen-hr'
import { AveragePaceScreen } from './screen-pace-average'
import { BatteryLevelScreen } from './screen-battery-level'
import { PaceScreen } from './screen-pace'
import { StepsScreen } from './screen-steps'
import { PaceGauge } from './screen-pace-gauge'
import { EndRunScreen } from './screen-end-run'
import { EntryScreen } from './screen-entry'
import { ExitScreen } from './screen-exit'
import { SummaryScreen } from './screen-summary'
import runMaster from './runmaster.class'
import { me } from "appbit";
import { vibration } from "haptics";
import { display } from "display";


class MultiScreenApp extends Application {
  
    DistanceScreen = new DistanceScreen();
    DurationScreen = new DurationScreen();
    HRScreen = new HRScreen();
    AverageHRScreen = new AverageHRScreen();
    AveragePaceScreen = new AveragePaceScreen();
    BatteryLevelScreen = new BatteryLevelScreen();
    StepsScreen = new StepsScreen();
    PaceScreen = new PaceScreen();
    PaceGauge = new PaceGauge();
    EndRunScreen = new EndRunScreen();
    EntryScreen = new EntryScreen();
    ExitScreen = new ExitScreen();
    SummaryScreen = new SummaryScreen();
    currentScreen='EntryScreen';
    statScreens = ['DistanceScreen', 'DurationScreen', 'StepsScreen', 'HRScreen', 'AverageHRScreen', 'PaceScreen', 'AveragePaceScreen', 'BatteryLevelScreen'];
    currentStatScreen=0;

    exitApp() {
      this.unmount();
      me.exit();
    }

    onMount(){
        Application.switchTo(this.currentScreen);
        runMaster.startSensors();
        runMaster.screenRendering();
        document.onkeypress = this.onKeyPress;
    }

    onUnmount() {
      runMaster.stopSensors();
    }

    onKeyPress = e => {
        e.preventDefault();
        if (display.on === false)
        display.poke();
        if( (e.key === 'up') && (runMaster.started=='Y') ) {
          vibration.start("nudge");
          console.log("Pause Key Event");
          runMaster.pause();
          Application.switchTo( this.statScreens[this.currentStatScreen] );
        } else 
        if( (e.key === 'up') && ((runMaster.started=='N')||(runMaster.started=='P')) ) {
          vibration.start("confirmation");
          console.log("Start Key Event");
          runMaster.start();
          Application.switchTo( this.statScreens[this.currentStatScreen] );
        }
        if( (e.key === 'down') && (runMaster.started!='N') ){
          vibration.start("bump");
          this.currentStatScreen++;
          if (this.currentStatScreen==this.statScreens.length) {
            this.currentStatScreen=0;
          }
          Application.switchTo( this.statScreens[this.currentStatScreen] );
        }
        if( e.key === 'back') {
            vibration.start("bump");
            this.currentScreen='EndRunScreen';
            if (this.screen === this.EntryScreen)  { this.currentScreen='ExitScreen'; }
            if (this.screen === this.SummaryScreen)  { this.currentScreen='ExitScreen'; }
            if (this.screen === this.EndRunScreen ) { this.currentScreen=this.statScreens[this.currentStatScreen] }
            if (this.screen === this.ExitScreen ) { 
              if ((runMaster.started=='Y')||(runMaster.started=='P')) { this.currentScreen=this.statScreens[this.currentStatScreen] } else
              if (runMaster.started=='E') { this.currentScreen='SummaryScreen'; } else { this.currentScreen='EntryScreen'; }
            }
            Application.switchTo( this.currentScreen );
        }
    }   
}
MultiScreenApp.start();