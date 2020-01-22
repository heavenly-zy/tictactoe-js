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

    function Game(el) {
        this.$el = el
        this.state = 'init'
        this.p1 = new Player(Player.random(), document.querySelector('#p1'))
        this.p2 = new Player(Player.random(this.p1.name), document.querySelector('#p2'))
        this.p1.render()
        this.p2.render()
        this.$diceP1 = this.$el.querySelector('#dice-p1')
        this.$diceP2 = this.$el.querySelector('#dice-p2')

        this.$start = this.$el.querySelector('.btn.start')
        this.$reset = this.$el.querySelector('.btn.reset')
        this.$overlay = this.$el.querySelector('.overlay')
        this.$reset.disabled = true

        this.$diceP1.addEventListener('click', Game.onClickDiceP1.bind(this))
        this.$diceP2.addEventListener('click', Game.onClickDiceP2.bind(this))

        this.$start.addEventListener('click', this.onClickStart.bind(this))

        var $squares = Array.from(this.$el.querySelectorAll('.square'))
        var onClickSquare = this.onClickSquare.bind(this)
        $squares.forEach(function (square) {
            square.addEventListener('click', onClickSquare)
        })
        this.squares = $squares.map(function (square) {
            return new Square(square)
        })
    }
    Game.onClickDiceP1 = function () {
        this.p1.reset(Player.random(this.p1.name))
        this.$start.disabled = (this.p1.name === this.p2.name)
    }
    Game.onClickDiceP2 = function () {
        this.p2.reset(Player.random(this.p2.name))
        this.$start.disabled = (this.p1.name === this.p2.name)
    }
    Game.prototype.onClickStart = function () {
        this.state = 'start'
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
        if (e.target.classList.length > 1) return
        this.squares[e.currentTarget.dataset.index].set(this.activePlayer().name, this.p1.active ? 1 : -1)
        this.switchPlayer()
    }
    Game.prototype.switchPlayer = function () {
        if (this.p1.active) {
            this.p1.setActive(false)
            this.p2.setActive(true)
        } else {
            this.p1.setActive(true)
            this.p2.setActive(false)
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 当初始的HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，而无需等待样式表、图像和子框架的完成加载。注意与onload的区别
        window.game = new Game(document.querySelector('.container'))
    })
})();