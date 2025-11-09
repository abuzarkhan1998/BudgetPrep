import {createIcons, icons} from 'lucide';
import * as Model from '../js/Views/settingsView';
import dashboardView from './Views/dashboardView';


const controlNavigation = function(targetPage){
    console.log(targetPage);
}


const init = function(){
createIcons({icons});
dashboardView.addHandlerNavigatePage(controlNavigation);
}

init();