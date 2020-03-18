import React from 'react';
import Checkbox from './Checkbox';
import theme from '../themes/default';
import ReactPlayer from 'react-player';

/* Represents data that will dictate how many checkboxes we need to render and what their labels will be.
const items = [
    'One',
    'Two',
    'Three',
];*/

class Checkboxes extends React.Component {

    /*
        Create empty set of checkboxes right before we mount this component.
    */
    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    }

    /*
        Gets label parameter that represents which checkbox is beign toggled.
        Let each Checkbox component instance maintain its own state.
        Only need to keep track of which checkboxes have been selected so we add to or delete from set.
    */
    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }
    }

    /*
        Print the label of every checked checkbox.
    */
    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();

        for (const checkbox of this.selectedCheckboxes) {
            console.log(checkbox, 'is selected.');
        }
    }

    /* Create and return an individual 'Checkbox' component instance.
        Each Checkbox component instance gets three properties:
        1. label - the text value you see rendered next to a checkbox. This value is coming from the items array. 
        2. handleCheckboxChange - a reference to this.toggleCheckbox function. Every time user checks/unchecks a checkbox React calls it.
        3. key - each dynamically created React component instance needs a key property that React uses to uniquely identify that instance. 
        */
    createCheckbox = label => (
        <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
        />
    )

    createCheckboxes = () => {
        /* Iterate over items array and create checkbox for each item*/
        const { items } = this.props;
        return items.map(this.createCheckbox)
    }

    /* Create instances of Checkbox component dynamically. */
    /* Create button of type submit which submits a form when user clicks on it. */
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <form onSubmit={this.handleFormSubmit}>
                            {this.createCheckboxes()}
                            <button className="btn btn-default" type="submit">Save</button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

export default Checkboxes;