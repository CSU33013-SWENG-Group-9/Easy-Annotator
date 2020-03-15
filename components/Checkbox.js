import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {

    /* Set the inital state of the Checkbox component: */
    state = {
        isChecked: false,
    }


    /* 
        Change Checkbox component's state. Set isChecked's value to 
        the opposite of its curent value and call handleCheckboxChange 
        function which is passed to Checkbox component as a property by 
        it's parent component.
        This will trigger toggleCheckbox function in the parent component 
        that will add or delete the label name from the set.
    */
    toggleCheckboxChange = () => {
        const { handleCheckboxChange, label } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

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