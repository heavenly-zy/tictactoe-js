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

    function Game(el) {
        this.$el = el
        this.p1 = new Player(Player.random(), document.querySelector('#p1'))
        this.p2 = new Player(Player.random(this.p1.name), document.querySelector('#p2'))
        this.p1.render()
        this.p2.render()
        this.$diceP1 = this.$el.querySelector('#dice-p1')
        this.$diceP2 = this.$el.querySelector('#dice-p2')

        this.$diceP1.addEventListener('click', Game.onClickDiceP1.bind(this))
        this.$diceP2.addEventListener('click', Game.onClickDiceP2.bind(this))
    }
    Game.onClickDiceP1 = function () {
        this.p1.reset(Player.random(this.p1.name))
    }
    Game.onClickDiceP2 = function () {
        this.p2.reset(Player.random(this.p2.name))
    }
    document.addEventListener('DOMContentLoaded', function () {
        // 当初始的HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，而无需等待样式表、图像和子框架的完成加载。注意与onload的区别
        window.game = new Game(document.querySelector('.container'))
    })
})();