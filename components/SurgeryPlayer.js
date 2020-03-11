import React from 'react';

import ReactPlayer from 'react-player';
import { Direction, FormattedTime, Slider, Button, PlayerIcon } from 'react-player-controls';

const WHITE_SMOKE = '#eee';
const GRAY = '#878c88';
const GREEN = '#72d687';

const SliderBar = ({ direction, value, style }) => (
  <div
    style={Object.assign(
      {},
      {
        position: 'absolute',
        background: GRAY,
        borderRadius: 4,
      },
      direction === Direction.HORIZONTAL
        ? {
            top: 0,
            bottom: 0,
            left: 0,
            width: `${value * 100}%`,
          }
        : {
            right: 0,
            bottom: 0,
            left: 0,
            height: `${value * 100}%`,
          },
      style
    )}
  />
);

const SliderHandle = ({ direction, value, style }) => (
  <div
    style={Object.assign(
      {},
      {
        position: 'absolute',
        width: 16,
        height: 16,
        background: GREEN,
        borderRadius: '100%',
        transform: 'scale(1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.3)',
        },
      },
      direction === Direction.HORIZONTAL
        ? {
            top: 0,
            left: `${value * 100}%`,
            marginTop: -4,
            marginLeft: -8,
          }
        : {
            left: 0,
            bottom: `${value * 100}%`,
            marginBottom: -8,
            marginLeft: -4,
          },
      style
    )}
  />
);

const TimeTooltip = ({ numSeconds, style = {} }) => (
  <div
    style={{
      display: 'inline-block',
      position: 'absolute',
      bottom: '150%',
      transform: 'translateX(-50%)',
      padding: 8,
      borderRadius: 3,
      color: 'white',
      backgroundColor: '#72d687',
      fontSize: 12,
      fontWeight: 'bold',
      lineHeight: 2,
      textAlign: 'center',
      ...style,
    }}
  >
    <FormattedTime numSeconds={numSeconds} />
  </div>
);

class SurgeryPlayer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      duration: 0,
      value: 0,
      lastIntent: null,
      playing: false,
      volume: 1,
      seeking: false,
    };
  }

  componentDidMount () {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const rem = document.getElementById('react-player').getBoundingClientRect().width - 60;
    this.setState({
      remainder: rem,
    });
  };

  handleProgress = (state) => {
    console.log('onProgress', state);

    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleDuration = (duration) => {
    this.setState({ duration });
  };

  onChange = (newValue) => {
    this.setState({ value: newValue });
    this.player.seekTo(parseFloat(newValue));
  };

  onChangeStart = (startValue) => {
    this.setState({seeking: true})
    this.player.seekTo(parseFloat(startValue));
  };

  onChangeEnd = (endValue) => {
    this.setState({ value: endValue, seeking: false });
    this.player.seekTo(parseFloat(endValue));
  };

  ref = (player) => {
    this.player = player;
  };

  render () {
    const { duration, value, lastIntent, playing, volume, remainder } = this.state;

    return (
      <div>
        <ReactPlayer
          ref={this.ref}
          id="react-player"
          url={this.props.url}
          width="80%"
          height="80%"
          playing={playing}
          volume={volume}
          //onProgress={this.handleProgress}
          onDuration={this.handleDuration}
        />
        <div>
          <div className="container">
            <div className="row">
              <div className="col-xs">
                {!playing ? (
                  <PlayerIcon.Play
                    width={12}
                    height={12}
                    style={{ marginLeft: 6, marginRight: 6 }}
                    onClick={() => this.setState({ playing: true })}
                  />
                ) : (
                  <PlayerIcon.Pause
                    width={12}
                    height={12}
                    style={{ marginLeft: 6, marginRight: 6 }}
                    onClick={() => this.setState({ playing: false })}
                  />
                )}
                {volume != 0 ? (
                  <PlayerIcon.SoundOn
                    width={12}
                    height={12}
                    style={{ marginRight: 12 }}
                    onClick={() => this.setState({ volume: 0 })}
                  />
                ) : (
                  <PlayerIcon.SoundOff
                    width={12}
                    height={12}
                    style={{ marginRight: 12 }}
                    onClick={() => this.setState({ volume: 1 })}
                  />
                )}
              </div>
              <div className="col-xs" style={{ padding: 10 }}>
                <Slider
                  isEnabled={true}
                  direction={Direction.HORIZONTAL}
                  onChange={this.onChange}
                  onChangeStart={this.onChangeStart}
                  onChangeEnd={this.onChangeEnd}
                  onIntent={(intent) => this.setState(() => ({ lastIntent: intent }))}
                  onIntentEnd={() => this.setState({ lastIntent: null })}
                  style={{
                    width: remainder,
                    height: 8,
                    borderRadius: 4,
                    background: WHITE_SMOKE,
                    transition: 'width 0.1s',
                    cursor: 'pointer',
                  }}
                >
                  <SliderBar direction={Direction.HORIZONTAL} value={value} style={{ background: GREEN }} />
                  <SliderBar
                    direction={Direction.HORIZONTAL}
                    value={lastIntent}
                    style={{ background: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <SliderHandle
                    direction={Direction.HORIZONTAL}
                    value={value}
                    style={{ background: GREEN, translate: '' }}
                  />

                  {lastIntent !== null && (
                    <TimeTooltip
                      numSeconds={lastIntent * duration}
                      style={{
                        left: `${lastIntent * 100}%`,
                      }}
                    />
                  )}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SurgeryPlayer;
