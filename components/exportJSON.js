import React from "react";
import ReactDOM from "react-dom";
import {Button} from "rebass";
import { Form, Dropdown, DropdownButton, Button } from "react-bootstrap";

import Canvas from "./canvas";
import SurgeryPlayer from "./SurgeryPlayer";


class exportJSON extends React.Component {
    constructor(props){
        super(props);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.state = {
            click : false,
        }
    };
}

return (
    <div
    onPointerDown={this.handlePointerDown}
    id="exportjson"
    >
        <Button variant="primary">Export JSON</Button>{' '}
    </div>
)
export default exportJSON;