import React from 'react';
import theme from '../themes/default';
import ReactPlayer from 'react-player';
import { Checkbox, FormControlLabel } from "@material-ui/core";

const items = [
    'One',
    'Two',
    'Three',
  ];

class Checkboxes extends React.Component {


    createCheckboxes = () => (
        /* Iterate over items array and create checkbox for each item*/
        items.map(this.createCheckbox)
    )

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <form onSubmit={this.handleFormSubmit}>
                            {/* Create instances of Checkbox component dynamically. */}
                            {this.createCheckboxes()}
                            {/* Create button of type submit which submits a form when user clicks on it. */}
                            <button className="btn btn-default" type="submit">Save</button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

export default Checkboxes;