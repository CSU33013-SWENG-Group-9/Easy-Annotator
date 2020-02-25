import React, { useRef } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";
import ReactPlayer from "react-player";

const canvasTemp = {
  margin: 40,
  padding: 40,
  border: "1px solid #DDDD"
};

const listROIs = [];

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.videoSize = React.createRef();
    this.state = {
      x: 0,
      y: 0,
      click: false,
      clickX: 0,
      clickY: 0,
      videoW: 0,
      videoH: 0,
      width: 0,
      height: 0
    };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  handlePointerDown(event) {
    this.setState({
      click: true,
      clickX: event.clientX,
      clickY: event.clientY,
      x: event.clientX,
      y: event.clientY
    });
  }

  handlePointerUp(event) {
    this.setState({
      click: false
    });

    listROIs.push({
      left: this.state.clickX,
      top: this.state.clickY,
      height: event.clientY - this.state.clickY,
      width: event.clientX - this.state.clickX
    });

    console.log(listROIs);
  }

  overVideo() {
    return true;
  }

  componentDidMount() {
    if (this.videoSize.current) {
      console.log(this.videoSize.current)
      const dimensions = this.videoSize.current.getBoundingClientRect();
      this.setState({
        videoW: dimensions.width,
        videoH: dimensions.height
      });
    }
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleStop = () => {
    this.setState({ url: null, playing: false });
  };

  handleToggleControls = () => {
    const url = this.state.url;
    this.setState(
      {
        controls: !this.state.controls,
        url: null
      },
      () => this.load(url)
    );
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleSetPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  handlePlay = () => {
    console.log("onPlay");
    this.setState({ playing: true });
  };

  handleEnablePIP = () => {
    console.log("onEnablePIP");
    this.setState({ pip: true });
  };

  handleDisablePIP = () => {
    console.log("onDisablePIP");
    this.setState({ pip: false });
  };

  handlePause = () => {
    console.log("onPause");
    this.setState({ playing: false });
  };

  handleSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  handleSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  handleProgress = state => {
    //console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    console.log("onEnded");
    this.setState({ playing: this.state.loop });
  };

  handleDuration = duration => {
    console.log("onDuration", duration);
    this.setState({ duration });
  };

  handleClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  };

  renderLoadButton = (url, label) => {
    return <button onClick={() => this.load(url)}>{label}</button>;
  };

  ref = player => {
    this.player = player;
  };

  render() {
    //console.log(test);
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip
    } = this.state;


    return (
      <div
        style={canvasTemp}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        {this.state.click && this.overVideo() && (
          <ResizableRect
            left={this.state.clickX}
            top={this.state.clickY}
            height={this.state.y - this.state.clickY}
            width={this.state.x - this.state.clickX}
            rotatable={false}
            zoomable="nw, ne, se, sw"
          />
        )}

        {listROIs.map(ROI => (
          <ResizableRect
            left={ROI.left}
            top={ROI.top}
            height={ROI.height}
            width={ROI.width}
            rotatable={false}
            zoomable="nw, ne, se, sw"
          />
        ))}
        <section className="section">
          <h1>ReactPlayer Demo</h1>
            <ReactPlayer
              style={{ display: "table-row", backgroundColor: 'red', border: "none", boxShadow: "none"}}
              id="video-player"
              ref={this.ref}
              className="react-player"
              url="https://www.cinemaworldtheaters.com/trailers/ABeautifulDay.mp4"
              playing={playing}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log("onReady")}
              onStart={() => console.log("onStart")}
              onPlay={this.handlePlay}
              onEnablePIP={this.handleEnablePIP}
              onDisablePIP={this.handleDisablePIP}
              onPause={this.handlePause}
              onBuffer={() => console.log("onBuffer")}
              onSeek={e => console.log("onSeek", e)}
              onEnded={this.handleEnded}
              onError={e => console.log("onError", e)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}

            />

          { this.player && 
            <p>
              {document.getElementById("video-player").clientWidth}, {document.getElementById("video-player").clientHeight}
            </p>
          }

          <table>
            <tbody>
              <tr>
                <th>Controls</th>
                <td>
                  <button onClick={this.handleStop}>Stop</button>
                  <button onClick={this.handlePlayPause}>
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button onClick={this.handleClickFullscreen}>
                    Fullscreen
                  </button>
                  {light && (
                    <button onClick={() => this.player.showPreview()}>
                      Show preview
                    </button>
                  )}
                  {ReactPlayer.canEnablePIP(url) && (
                    <button onClick={this.handleTogglePIP}>
                      {pip ? "Disable PiP" : "Enable PiP"}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <button onClick={this.handleSetPlaybackRate} value={1}>
                    1x
                  </button>
                  <button onClick={this.handleSetPlaybackRate} value={1.5}>
                    1.5x
                  </button>
                  <button onClick={this.handleSetPlaybackRate} value={2}>
                    2x
                  </button>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={this.handleVolumeChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

export default Canvas;
