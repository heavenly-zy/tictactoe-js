(function () {
    function Player(name, el) {
        this.name = name
        this.active = false
        this.$el = el
        this.$caret = this.$el.querySelector('.caret')
    }
    Player.prototype.render = function () {
        this.$el.className = this.name
    }
    Player.prototype.reset = function (name) {
        this.name = name
        this.render()
    }
    Player.random = function (exclude) { // 静态方法：只能通过这个类调用，不能通过实例调用
        var players = ['vue', 'react', 'angular']
        if (exclude) {
            players = players.filter(function (player) {
                return player !== exclude
            })
        }
        return players[Math.floor(Math.random() * players.length)] // 0,1,2
    }
    Player.prototype.setActive = function (active) {
        this.active = !!active
        this.$caret.hidden = !active
    }

    function Square(el) {
        this.$el = el
        this.value = 0
    }
    Square.prototype.set = function (name, value) {
        this.value = value
        this.$el.classList.add(name)
    }
    Square.prototype.reset = function () {
        this.value = 0
        this.$el.className = 'square'
    }

    function Game(el) {
        this.$el = el
        this.p1 = new Player(Player.random(), document.querySelector('#p1'))
        this.p2 = new Player(Player.random(this.p1.name), document.querySelector('#p2'))
        this.p1.render()
        this.p2.render()
        this.$diceP1 = this.$el.querySelector('#dice-p1')
        this.$diceP2 = this.$el.querySelector('#dice-p2')
        this.$winner = this.$el.querySelector('.winner')
        this.$deuce = this.$el.querySelector('.deuce')
        this.$start = this.$el.querySelector('.btn.start')
        this.$reset = this.$el.querySelector('.btn.reset')
        this.$overlay = this.$el.querySelector('.overlay')
        this.$playground = this.$el.querySelector('.playground')
        this.$reset.disabled = true

        this.$diceP1.addEventListener('click', Game.onClickDice.bind(this))
        this.$diceP2.addEventListener('click', Game.onClickDice.bind(this))

        this.$start.addEventListener('click', this.onClickStart.bind(this))
        this.$reset.addEventListener('click', this.onClickReset.bind(this))

        var $squares = Array.from(this.$el.querySelectorAll('.square'))
        this.$playground.addEventListener('click', this.onClickSquare.bind(this))
        this.squares = $squares.map(function (square) {
            return new Square(square)
        })
    }
    Game.onClickDice = function (e) {
        if (e.target.getAttribute('id') === 'dice-p1') this.p1.reset(Player.random(this.p1.name))
        if (e.target.getAttribute('id') === 'dice-p2') this.p2.reset(Player.random(this.p2.name))
        this.$start.disabled = (this.p1.name === this.p2.name)
    }
    Game.prototype.onClickStart = function () {
        this.setDiceHidden(true)
        this.p1.setActive(true)
        this.p2.setActive(false)
        this.$overlay.hidden = true
        this.$reset.disabled = false
    }
    Game.prototype.setDiceHidden = function (hidden) {
        this.$diceP1.hidden = !!hidden
        this.$diceP2.hidden = !!hidden
    }
    Game.prototype.activePlayer = function () {
        return this.p1.active ? this.p1 : this.p2
    }
    Game.prototype.onClickSquare = function (e) {
        if (e.target.className !== 'square' || this.isEnded() || e.target.classList.length > 1) return
        this.squares[e.target.dataset.index].set(this.activePlayer().name, this.p1.active ? 1 : -1)
        var winner = this.getWinner()
        if (winner) {
            this.showWinner(winner)
            return
        }
        if (this.getDeuce()) {
            this.showDeuce()
            return
        }
        this.switchPlayer()
    }
    Game.prototype.switchPlayer = function () {
        this.p1.setActive(this.p1.active ? false : true)
        this.p2.setActive(this.p1.active ? false : true)
    }
    Game.prototype.isAllSquaresUsed = function () {
        return !this.squares.find(square => square.value === 0)
    }
    Game.prototype.calcWinValues = function () {
        var wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        var result = [];
        for (var i = 0; i < wins.length; i++) {
            var value = this.squares[wins[i][0]].value + this.squares[wins[i][1]].value + this.squares[wins[i][2]].value
            result.push(value)
        }
        return result;
    }
    Game.prototype.getWinner = function () {
        var calcResult = this.calcWinValues()
        if (calcResult.find(value => value === 3)) return this.p1
        if (calcResult.find(value => value === -3)) return this.p2
    }
    Game.prototype.isEnded = function () {
        return !!this.getWinner() || this.isAllSquaresUsed() || this.getDeuce()
    }
    Game.prototype.showWinner = function (winner) {
        this.$overlay.classList.add('minimize')
        this.$overlay.hidden = false
        this.$winner.hidden = false
        this.$start.hidden = true
        this.$winner.classList.add(winner.name)
        setTimeout(() => { // 注意setTimeout里的this会发生变化，因此这里使用箭头函数
            this.$overlay.classList.remove('minimize')
        }, 300)
    }
    Game.prototype.onClickReset = function () {
        this.setDiceHidden(false)
        this.squares.forEach(square => square.reset())
        this.p1.setActive(false)
        this.p2.setActive(false)
        this.$winner.hidden = true
        this.$winner.className = 'winner'
        this.$overlay.hidden = false
        this.$start.hidden = false
        this.$reset.disabled = true
        this.$deuce.hidden = true
    }
    Game.prototype.getWinner = function () {
        var calcResult = this.calcWinValues()
        if (calcResult.find(value => value === 3)) return this.p1
        if (calcResult.find(value => value === -3)) return this.p2
    }
    Game.prototype.getDeuce = function () {
        return this.isAllSquaresUsed() && this.getWinner() === undefined // square使用完且还未分出胜负即为平局
    }
    Game.prototype.showDeuce = function () {
        this.$overlay.classList.add('minimize')
        this.$overlay.hidden = false
        this.$deuce.hidden = false
        this.$start.hidden = true
        setTimeout(() => {
            this.$overlay.classList.remove('minimize')
        }, 300)
    }
    document.addEventListener('DOMContentLoaded', function () {
        // 当初始的HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，而无需等待样式表、图像和子框架的完成加载。注意与onload的区别
        window.game = new Game(document.querySelector('.container'))
    })
})();