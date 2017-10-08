import React from 'react';
import Square from './square';

class Board extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            squares: Array(this.props.xSize * this.props.ySize).fill('')
        }
    }

    handleClick(i) {
        let self = this;
        
        if (self.state.squares[i] !== '') { return; }

        const squares = self.state.squares.slice();
        squares[i] = self.props.players[self.props.turn];
        self.props.setNextTurn(self.getNextTurn());

        self.setState({ squares: squares }, function () {
            let winner = self.getWinner();
            if (winner) {
                setTimeout(() => {
                    alert('We have a winner! Congratz, ' + winner);
                    self.resetGame();
                }, 100);
            }
        });

    }

    resetGame() {
        this.setState({ squares: Array(this.props.xSize * this.props.ySize).fill('') })
        this.props.setNextTurn(0);
    }

    getNextTurn() {
        let nextTurn = this.props.turn + 1;
        if (nextTurn >= this.props.players.length) { nextTurn = 0; }
        return nextTurn;
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.props.xSize && y >= 0 && y < this.props.ySize;
    }

    getIndex(x, y) {
        return (y * this.props.xSize) + x;
    }

    getCoor(i) {
        const x = (i % this.props.xSize);
        const y = (i - x) / this.props.xSize;
        return [x, y];
    }

    getWinner = function () {
        let self = this;
        let checkRow = '', checkCol = '', checkDiag1 = '', checkDiag2 = '';
        let diag1 = {}, diag2 = {};

        for (let i = 0; i < self.props.xSize; i++) {
            for (let j = 0; j < self.props.ySize; j++) {
                // cols & rows
                var sqRow = self.state.squares[self.getIndex(i, j)];
                var sqCol = self.state.squares[self.getIndex(j, i)];
                checkRow += sqRow ? sqRow : '.';
                checkCol += sqCol ? sqCol : '.';
                // diagonals
                if (!diag1[i - j]) { diag1[i - j] = []; }
                if (!diag2[i + j]) { diag2[i + j] = []; }
                var sqDiag = self.state.squares[self.getIndex(i, j)];
                diag1[i - j].push(sqDiag ? sqDiag : '.');
                diag2[i + j].push(sqDiag ? sqDiag : '.');
            }
            checkRow += 'n';
            checkCol += 'n';
        }

        Object.keys(diag1).map(function (i) {
            checkDiag1 += diag1[i].join('');
            checkDiag1 += 'n';
            return i;
        });
        Object.keys(diag2).map(function (i) {
            checkDiag2 += diag2[i].join('');
            checkDiag2 += 'n';
            return i;
        });

        let state = checkRow + '-' + checkCol + '-' + checkDiag1 + '-' + checkDiag2;
        let players = self.props.players.map((i) => { return i.repeat(self.props.consecutiveWins); });
        let reg = players.join('|');
        let matches = state.match(reg);
        if (matches && matches.length > 0) { return matches[0].substr(0, 1); }
        return null;
    }

    render() {
        let squares = [];
        for (let yi = 0; yi < this.props.ySize; yi++) {
            let row = [];
            for (let xi = 0; xi < this.props.xSize; xi++) {
                row.push(
                    <Square
                        key={'sq-' + xi + '-' + yi}
                        value={this.state.squares[this.getIndex(xi, yi)]}
                        onClick={() => this.handleClick(this.getIndex(xi, yi))}
                    />
                )
            }
            squares.push(<div key={'row-' + yi} className="board-row">{row}</div>);
        }

        return (
            <div>{squares}</div>
        );
    }
}


export default Board