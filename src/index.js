import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var classNames = require('classnames');

function Square(props){
	var btnClass = classNames({
		square: true,
		squareWinner: false
	});
	return (
		
		<button className={btnClass} onClick={props.onClick} id={props.id}>
			{props.value}
		</button>
	);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  	return {
		player: squares[a],
		winningSquares: lines[i]
	};
    }
  }
  return null;
}

class Board extends React.Component {
	
  renderSquare(i) {
    return (<Square 
		value={this.props.squares[i]}
		onClick = {() => this.props.onClick(i)}
		id = {i}
	/>);
  }

	createBoard(){
		let rows = [];
		for(var i=0;i<3;i++){
			let squares = [];
			for(var j=0;j<3;j++)
				squares.push(this.renderSquare(i*3 + j));
			rows.push(<div className="board-row">{squares}</div>);
		}
		return rows;
	}
	
  render() {
		
    return (
      <div>
  			{
					this.createBoard()
				}
      </div>
    );
  }
}

class Game extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true
		};
	}
	
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber+1);
		const current = history[history.length-1];
		const squares = current.squares.slice();
		
		if(calculateWinner(squares) || squares[i])
			return;
		squares[i] = this.state.xIsNext?'X':'O';
		this.setState({
			history: history.concat({
				squares: squares
			}),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}
	
	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step%2)===0
		})
	}
	
	highlightWinner(squares){
		const winnerCSS = "squareWinner";
		
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move)=>{
			const desc = move ? 
						"Go to move # " + move:
						"Go to start";
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status; 
		if(winner){
			status = "Winner: " + winner.player;
			this.highlightWinner(winner.winningSquares);
		} else if(this.state.stepNumber===9 && !winner){
			status = "The game is a draw.";
		} 
		else {
			status = 'Next player: ' + (this.state.xIsNext?'X':'O');	
		}
		
		return (
			<div className="game">
			<div className="game-board">
				<Board 
					squares= {current.squares}
					onClick={(i)=>this.handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{moves}</ol>
			</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
