import React from "react";
import ReactDOM from "react-dom";
import {Button} from "rebass"; 

import Canvas from "./canvas";
import SurgeryPlayer from "./SurgeryPlayer";

const handleSaveToPC = jsonData => {
    var jsonData = {
        
            "offset_ms": 110000,
            "time_to_track_ms": 270000,
            "short_name": "demo",
            "device_type": "Stryker PINPOINT",
            "frame_rate": 30,
            "store_folder": "folder/to/store/stuff/including/this/json",
            "comment": "this is a comment on the entire video",
            "file_location": "some/path/to/the/video/file",
            "ROIs": [
                {
                    "number": 0,
                    "label": "normal",
                    "location": [
                        40,
                        23,
                        25,
                        10
                    ],
                    "comment": "this is a comment on ROI 0"
                },
                {
                    "number": 1,
                    "label": "suspicious",
                    "location": [
                        80,
                        99,
                        27,
                        20
                    ],
                    "comment": "this is a comment on ROI 1"
                },
                {
                    "number": 4,
                    "label": "unknown",
                    "location": [
                        55,
                        53,
                        40,
                        23
                    ],
                    "comment": "this is a comment on ROI 4"
                }
            ]
        
      };
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'results.json';
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