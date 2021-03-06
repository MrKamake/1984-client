import React, { Component } from 'react';
import './GameWebView.scss';
import CountUp from 'react-countup';
import Modal from './Modal';
// import { rankingAPI } from '../../Api/postApi';

class GameWebView extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.scoreRef = React.createRef();
    this.ctx = null;
    this.state = { score: 0, isModalOpen: false, countupEndNumber: 10000 };
  }

  componentDidMount() {
    const { airplane, obstacles } = this.props;

    this.ctx = this.canvasRef.current.getContext('2d');
    this._updateGame([airplane, ...obstacles]);
  }

  componentDidUpdate() {
    const { airplane, obstacles } = this.props;

    if (!this.state.isModalOpen) {
      this._updateGame([airplane, ...obstacles]);
    }
  }

  _clearCanvas = () => {
    this.ctx.clearRect(0, 0, 3000, 15000);
  };

  _update = unit => {
    const imageData = new Image();
    imageData.src = unit.src;

    this.ctx.drawImage(imageData, unit.x, unit.y, unit.width, unit.height);
    // this.ctx.fillStyle = unit.color;
    // this.ctx.fillRect(unit.x, unit.y, unit.width, unit.height);
  };

  _crashWith = unitList => {
    const myleft = unitList[0].x;
    const myright = unitList[0].x + unitList[0].width;
    const mytop = unitList[0].y;
    const mybottom = unitList[0].y + unitList[0].height;
    const otherleft = unitList[1].x;
    const otherright = unitList[1].x + unitList[1].width;
    const othertop = unitList[1].y;
    const otherbottom = unitList[1].y + unitList[1].height;
    let crash = true;

    if (
      mybottom <= othertop ||
      mytop >= otherbottom ||
      myright <= otherleft ||
      myleft >= otherright
    ) {
      crash = false;
    }
    return crash;
  };

  _stopGame = () => {
    const { gameOver, clearObstacleInterval } = this.props;
    const score = Number(this.scoreRef.current.firstElementChild.innerText);

    // const rankingData = { nickname, score };
    // rankingAPI(rankingData);
    clearObstacleInterval();
    this.setState({ score, isModalOpen: true, countupEndNumber: 0 });
    gameOver();
  };

  _updateGame = unitList => {
    for (let i = 1; i < unitList.length; i++) {
      if (this._crashWith([unitList[0], unitList[i]])) {
        this._stopGame();
      }
    }
    this._clearCanvas();

    for (let i = 0; i < unitList.length; i++) {
      this._update(unitList[i]);
    }
  };

  render = () => {
    const { isRankingOpened } = this.props;
    const { score, isModalOpen, countupEndNumber } = this.state;

    return (
      <div className="web-game-view">
        <div className="main-logo">1984</div>
        <div className="canvas-wrapper">
          <canvas
            className="main-viewer"
            ref={this.canvasRef}
            width={'3000px'}
            height={'3000px'}
          />
        </div>
        <div className="count-up-box" ref={this.scoreRef}>
          <CountUp
            className="count-up"
            start={0}
            end={countupEndNumber}
            duration={8000}
          />
        </div>
        {isModalOpen && (
          <Modal score={score} isRankingOpened={isRankingOpened} />
        )}
      </div>
    );
  };
}

export default GameWebView;
