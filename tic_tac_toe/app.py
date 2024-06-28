from flask import Flask, render_template, request, jsonify
from tic_tac_toe import TicTacToe
from players import HumanPlayer, SmartComputerPlayer

app = Flask(__name__)

t = TicTacToe()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    move = data['move']
    player = data['player']
    if t.make_move(move, player):
        if t.current_winner:
            return jsonify({"winner": player})
        else:
            return jsonify({"status": "continue"})
    return jsonify({"status": "invalid"})

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/ai_move', methods=['POST'])
def ai_move():
    data = request.json
    board = data['board']
    ai_player = SmartComputerPlayer('O')
    move = ai_player.get_move(TicTacToe(board))
    
    if t.make_move(move, 'O'):
        if t.current_winner:
            return jsonify({"move": move, "winner": 'O'})
        else:
            return jsonify({"move": move, "status": "continue"})
    return jsonify({"status": "invalid"})
