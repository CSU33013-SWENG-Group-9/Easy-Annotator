import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {

    /* Set the inital state of the Checkbox component: */
    state = {
        isChecked: true,
    }

    /* 
        - Switch the visibility of the corresponding roi
        - Switch the state of this component
        - Call the callback function passed from the parent to handle a checkbox change
    */
    toggleCheckboxChange = () => {
        this.props.roi.visible = !this.props.roi.visible;
        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));
        const { handleCheckboxChange, label } = this.props;
        handleCheckboxChange(label);
    }

    /*
        Render div element. Inside of it is the label element with two children: 1) input element and 2) label text.
        The input element renders the checkbox. It has 4 properties:
            1. type - type of input: checkbox in this case
            2. value - the value of the input: which is a label name passed as a property from a parent component
            3. checked - whether it's checked or not. Comes from the component's state property isChecked
            4. onChange - change event handler: this.toggleCheckboxChange function will be called when user checks or unchecks a checkbox
        The label text is coming from a property label that is passed from parent component.
    */
    render() {
        const { label } = this.props;
        const { isChecked } = this.state;
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />
                    {label}
                </label>
            </div>
        );
    }
}

export default Checkbox;