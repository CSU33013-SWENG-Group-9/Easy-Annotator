import React from "react";
import ReactDOM from "react-dom";
import {Button} from "rebass"; 

import Canvas from "./canvas";
import SurgeryPlayer from "./SurgeryPlayer";

const handleSaveToPC = jsonData => {
     jsonData = {
        "this": "is",
        "only": "filler",
        "information":"I hope"
      };
    const fileData = JSON.stringify(jsonData, null, 10);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'bigBrainInfoMashin.json';
    link.href = url;
    link.click();
  }

class ExportJSON extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            click : false,
            json : null
        }
    };

    exportJSON(){
        handleSaveToPC();
    }

    render(){
        return (
            <div>
                <Button onClick={this.exportJSON}>Export JSON</Button>
            </div>
        )
    }; 
}
export default ExportJSON;