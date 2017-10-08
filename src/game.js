import React from 'react';
import Board from './board';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            xSize: 5,
            ySize: 5,
            players: ['X', 'O', 'Z'],
            consecutiveWins: 4,
            turn: 0
        }
    }

    updateSizeX(e) { this.updateSize(e.target.value, this.state.ySize); }
    updateSizeY(e) { this.updateSize(this.state.xSize, e.target.value); }
    updateSize(x, y) {
        let self = this;
        self.setState({ xSize: x, ySize: y }, () => {
            self.board.resetGame();
        });
    }

    updateWins(e) {
        let self = this;
        self.setState({ consecutiveWins: e.target.value }, () => {
            self.board.resetGame();
        });
    }

    newPlayer() {
        let self = this;
        let taken = true, empty = true, long = true;
        let name = prompt('Player Name: ');
        if (name === null) { return; }
        while (taken || empty || long) {
            taken = self.state.players.indexOf(name) !== -1;
            empty = name.length === 0;
            long = name.length > 1;
            if (taken) { name = prompt('Name taken. Enter another name: '); }
            else if (empty) { name = prompt('Empty. Please enter a name: '); }
            else if (long) { name = prompt('Name should be single character: Enter another name: '); }
        }
        const players = self.state.players.slice();
        players.push(name);
        self.setState({ players: players }, () => {
            self.board.resetGame();
        });
    }

    removePlayer() {
        let self = this;
        let name = prompt('Player to remove: ');
        if (name === null) { return; }
        let playerIndex = this.state.players.indexOf(name);
        if (playerIndex !== -1) {
            const players = self.state.players.slice();
            players.splice(playerIndex, 1);
            self.setState({ players: players }, () => {
                self.board.resetGame();
            });
        }
        else { alert('Player not found'); }
    }

    resetGame() { this.board.resetGame(); }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        {...this.state}
                        ref={(board) => { this.board = board }}
                        setNextTurn={(turn) => this.setState({ turn: turn })}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <b>Next player: </b>
                        {this.state.players[this.state.turn]} 
                        <button style={{ marginLeft: 5 }} onClick={() => this.resetGame()}>Reset</button>
                    </div>
                    <div>
                        <b>Players: </b>
                        {
                            this.state.players.map(function (i) {
                                return <div className="players-list" key={i}>{i}</div>
                            })
                        }
                        <button onClick={() => this.newPlayer()}>Add</button>
                        <button onClick={() => this.removePlayer()} disabled={this.state.players.length <= 2}>Remove</button>
                    </div>
                    <div>
                        <b>Target: </b>
                        <input type="text" className="board-input" value={this.state.consecutiveWins} onChange={(e) => this.updateWins(e)} />
                    </div>
                    <div>
                        <b>Board: </b>
                        <input type="text" className="board-input" value={this.state.xSize} onChange={(e) => this.updateSizeX(e)} /> x
                            <input type="text" className="board-input" value={this.state.ySize} onChange={(e) => this.updateSizeY(e)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;