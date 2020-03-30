import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class LayerPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { listrois, selected } = this.props;
    return (
      <div style={styles.layersWrapper}>
        {listrois &&
          listrois.map((rois, index) => {
            //Fix coloring of layer panel
            return (
              <div
                style={{
                  ...styles.layer,
                  background: selected === index ? "accent" : "primary"
                }}
                key={index}
              >
                <div
                  style={styles.eyeWrapper}
                  onClick={() => {
                    this.props.onEyeClick(index);
                  }}
                >
                  {rois.visible ? (
                    <FontAwesomeIcon
                      onClick={() => {
                        this.props.onEyeClick;
                      }}
                      icon={faEye}
                      style={styles.eye}
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => {
                        this.props.onEyeClick;
                      }}
                      icon={faEyeSlash}
                      style={styles.eye}
                    />
                  )}
                </div>
                <div
                  style={styles.textWrapper}
                  onClick={() => {
                    this.props.setSelected(index);
                  }}
                >
                  <span>{rois.label.title}</span>
                  <span>{rois.label.type}</span>
                </div>
                <div
                  style={styles.timeWrapper}
                  onClick={() => {
                    this.props.setSelected(index);
                  }}
                >
                  {rois.numSeconds}
                  <FontAwesomeIcon
                    onClick={() => {
                      this.props.onDeleteClick(index);
                    }}
                    icon={faTrash}
                    style={styles.eye}
                  />
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
const borderColor = "rgb(221, 221, 221)";

const styles = {
  layersWrapper: {
    height: "100%"
  },
  layer: {
    border: `1px solid`,
    height: 58,
    display: "flex"
  },
  eyeWrapper: {
    width: "15%",
    borderRight: `1px solid`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  eye: {
    cursor: "pointer",
    fontSize: "15"
  },
  textWrapper: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 20
  },
  timeWrapper: {
    width: "15%",
    display: "flex",
    alignItems: "center"
  }
};

export default LayerPanel;
