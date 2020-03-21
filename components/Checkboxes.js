import React from 'react';
import Checkbox from './Checkbox';
import theme from '../themes/default';

class Checkboxes extends React.Component {

    componentWillMount = () => {
        /* Create empty set of checkboxes right before we mount this component. */
        this.selectedCheckboxes = new Set();
    }

    createCheckboxes = () => {
        /* Iterate over items array and create checkbox for each item*/
        const { items } = this.props;
        return items.map(this.createCheckbox)
    }

    /* Create and return an individual 'Checkbox' component instance.
        Each Checkbox component instance gets four properties:
        1. label - the text value you see rendered next to a checkbox. This value is coming from the items array. 
        2. handleCheckboxChange - a reference to this.toggleCheckbox function. Every time user checks/unchecks a checkbox React calls it.
        3. key - each dynamically created React component instance needs a key property that React uses to uniquely identify that instance. 
        4. roi - the roi associated with it
        */
    createCheckbox = roi => (
        <Checkbox
            label={roi.label}
            handleCheckboxChange={this.toggleCheckbox}
            key={roi.label}
            roi={roi}
        />
    )

    toggleCheckbox = () => {
        /* When a Checkbox is toggled, call the callback function which updates the ROIs. */
        this.props.roisCallback(this.props.items);
    }

    render() {
        return (
            <div>
                {this.createCheckboxes()}
            </div>
        );
    }
}
export default Checkboxes;