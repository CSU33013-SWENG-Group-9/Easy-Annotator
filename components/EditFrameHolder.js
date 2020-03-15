import React from "react";
import Canvas from "../components/Canvas";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import BottomScrollListener from "react-bottom-scroll-listener";

class EditFrameHolder extends React.Component {
  state = {
    check: []
  };

  handleChange(key, event) {
    let s = this.state.check;
    s[key] = event.target.checked;
    this.setState({ check: s});
  }

  componentDidMount() {
    this.setState({
      canvas: document.getElementById("canvas")
    });

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const h = document.getElementById("canvas").getBoundingClientRect();
    this.setState({ height: h.height });
  };

  render() {
    var data = [
    ];

    return (
      <div className="container" fluid="true">
        <div className="row justify-content-md-center">
          <div className="col">
            <div className="row">
              <Canvas id="canvas" />
            </div>
          </div>
          <div className="col">
            <div
              className="inner-scroll-example"
              style={{ height: this.state.height }}
            >
              <BottomScrollListener onBottom={this.handleContainerOnBottom}>
                {scrollRef => (
                  <div ref={scrollRef} className="inner-scroll-example">
                    {data.map((value, index) => (
                      <div key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={this.handleChange.bind(this, index)}
                              checked={this.state.check[index]}
                            />
                          }
                          label={value}
                        />
                        <b />
                      </div>
                    ))}
                  </div>
                )}
              </BottomScrollListener>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditFrameHolder;