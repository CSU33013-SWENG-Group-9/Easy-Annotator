import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Layers(props) {
    const {listrois, selected} = props
    return (
        <div style={styles.layersWrapper}>
            {listrois && listrois.map((rois, index) => {
                return(
                    <div style={{...styles.layer,background: selected === index ? '#e9e9e9': 'white' }} key={index}>
                        <div style={styles.eyeWrapper} onClick={() => {props.onEyeClick(index)}}>
                            {rois.visible ? 
                                <FontAwesomeIcon  onClick={() => {props.onEyeClick}} icon={faEye} style={styles.eye}/>
                                : <FontAwesomeIcon  onClick={() => {props.onEyeClick}} icon={faEyeSlash} style={styles.eye}/>
                            }
                        </div>
                        <div style={styles.textWrapper} onClick={() => {props.setSelected(index)}}>
                            <span>{rois.label.title}</span>
                            <span>{rois.label.type}</span>
                        </div>
                        <div style={styles.timeWrapper}  onClick={() => {props.setSelected(index)}}>
                            {rois.numSeconds}
                            <FontAwesomeIcon  onClick={() => {props.onDeleteClick(index)}} icon={faTrash} style={styles.eye}/>
                        </div>                           
                    </div> 
                )
            })}  
        </div>
    )
}
