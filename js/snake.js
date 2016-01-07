const COLS=20, ROWS=20;
const EMPTY=0, SNAKE=1, FRUIT=2;
const KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;
const DIR = {
  LEFT: 0, 
  UP: 1, 
  RIGHT: 2, 
  DOWN: 3
};
var display, sidebar, input, frames, score;
var euroSprite, cigarSprite, pulmonSprite;

var grid = {
  width: null,
  height: null,
  _grid: null,
  init: function(d, c, r) {
    this.width = c;
    this.height = r;
    this._grid = [];
    for (var i = 0; i < c; i++) {
      this._grid.push([]);
      for (var j = 0; j < r; j++) {
        this._grid[i].push(d);
      }
    }
  },
  set: function(val, x, y) {
    this._grid[x][y] = val;
  },
  get: function(x,y) {
    return this._grid[x][y];
  }
};

var snake = {
  direction:null,
  last: null,
  _queue:null,
  init: function(d, x, y) {
    this.direction = d;
    this._queue = [];
    this.insert(x,y);
  },
  insert: function(x, y) {
    this._queue.unshift({x:x, y:y});
    this.last = this._queue[0];
  },
  remove: function() {
    return this._queue.pop();
  }
};

function setFood() {
  var empty = [];
  for (var x=0; x < grid.width; x++) {
    for (var y=0; y < grid.height; y++) {
      if(grid.get(x,y) === EMPTY) empty.push({x:x, y:y});
    }
  }
  var randpos = empty[Math.floor(Math.random()*empty.length)];
  grid.set(FRUIT, randpos.x, randpos.y);
}

function main() {
  display = new Display("scene", 700, 700);
  sidebar = new Display("sidebar", 400, 700);
  input = new InputHandler();

  var spritesheet = new Image();
  spritesheet.src = "gfx/spritesheet.png";

  window.addEventListener("load", function() {
      cigarSprite = new Sprite(spritesheet, 0, 0, 220, 210);
      euroSprite = new Sprite(spritesheet, 220, 0, 240, 240);
      pulmonSprite = new Sprite(spritesheet, 520, 0, 512, 1024);
      init();
      run();
  });      
}
function run() {
  var loop = function() {
    update();
    draw();
    window.requestAnimationFrame(loop, display.canvas);
  };
  window.requestAnimationFrame(loop, display.canvas);
}
function init() {
  sidebar.ctx.font = "bold 18px Arial";
  frames = 0;
  score = 0;
  grid.init(EMPTY, COLS, ROWS);
  var sp = {x:Math.floor(COLS/2), y:ROWS-1};
  snake.init(DIR.UP, sp.x, sp.y);
  grid.set(SNAKE, sp.x, sp.y);
  setFood();
}
function update() {
  frames++;

  if (input.isPressed(KEY_LEFT) && snake.direction !== DIR.RIGHT) snake.direction = DIR.LEFT;
  if (input.isPressed(KEY_UP) && snake.direction !== DIR.DOWN) snake.direction = DIR.UP;
  if (input.isPressed(KEY_RIGHT) && snake.direction !== DIR.LEFT) snake.direction = DIR.RIGHT;
  if (input.isPressed(KEY_DOWN) && snake.direction !== DIR.UP) snake.direction = DIR.DOWN;

  if(frames %8 === 0) {
    var nx = snake.last.x;
    var ny = snake.last.y;

    switch(snake.direction) {
      case DIR.LEFT:
      nx--;
      break;
      case DIR.UP:
      ny--;
      break;
      case DIR.RIGHT:
      nx++;
      break;
      case DIR.DOWN:
      ny++;
      break;
    }

    /*if (nx < 0 || nx > grid.width-1 || 
        ny < 0 || ny > grid.height-1) {
    }*/
    
    var tail = {x: null, y: null};
    if (nx < 0) {
      tail = snake.remove();
      grid.set(EMPTY, tail.x, tail.y);
      tail.x = grid.width-1;
    }
    else if (nx > grid.width-1) {
      tail = snake.remove();
      grid.set(EMPTY, tail.x, tail.y);
      tail.x = 0;
    } else {
      if (grid.get(nx, ny) === SNAKE) return init();
      if (grid.get(nx, ny) === FRUIT) {
        tail.x = nx;
        tail.y = ny;
        score++;
        setFood();
      } else {
        tail = snake.remove();
        grid.set(EMPTY, tail.x, tail.y);
        tail.x = nx;
        if (ny < 0) tail.y = grid.height-1;
        else if (ny > grid.height-1) tail.y = 0;
        else tail.y = ny;
      }
    }
    grid.set(SNAKE, tail.x, tail.y);
    snake.insert(tail.x, tail.y);
  }
}
function draw() {
  display.clear();
  sidebar.clear();
  var tw = display.width/grid.width;
  var th = display.height/grid.height;

  display.drawRect('#2105a3', 0, 0, display.width, display.height);
  display.ctx.save();
  display.drawSprite(pulmonSprite, -display.width*0.1, display.height*0.08, display.width*0.5, display.height*0.9);

  for (var x=0; x < grid.width; x++) {
    for (var y=0; y < grid.height; y++) {
      switch (grid.get(x,y)) {
        case SNAKE:
        display.drawSprite(euroSprite, x*tw, y*th, tw, th);
        break;
        case FRUIT:
        display.drawSprite(cigarSprite, x*tw, y*th, tw, th);
        break;
      }
    }
  }
  display.ctx.restore();

  sidebar.drawText("PUNTUACIÓN:  " + score, display.width*0.03, display.height*0.05, 'black');
  sidebar.ctx.restore();
}
main();