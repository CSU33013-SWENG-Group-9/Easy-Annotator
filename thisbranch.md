# List of changes for this branch to implement checkbox functionality

## layout.js
- All code removed from the render function and replaced with PageBody component

## PageBody.js
- Original code from layout put into new component, to allow rois to in the state of the parent of both the canvas and checkboxes
- Constructor added initializing rois to empty array
- roisCallback defined, which allows a child component to update the rois in state
- roisCallback passed to canvas
- Checkboxes component put under ROIS DROP DOWN text, which takes the rois and roisCallback 

## Canvas.js
- visible: true added to newROIS.push in handlePointerUp()
- this.props.roisCallback(newROIs) added to end of handlePointerUp()
- in render(), in listrois.map(ROI, index) => <ResizableRect> etc, ROI.visible && is added to ensure that they are only rendered if their visible property is on

## Checkboxes.js
- Added this component to represent the list of checkboxes

## Checkbox.js
- Added this component to represent an individual checkbox