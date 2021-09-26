var rows = 25; var cols = 25; var w;
var prob_of_obstacles = 0.1;
var start_x; var start_y;  
var end_x; var end_y;
var grid = new Array(cols);
var openSet = []; var closedSet = [];
var path = [];
var checked = false;

function RemoveCurrent(arr, obj) {
  for (let j = arr.length - 1; j >= 0; j--) {
    if (arr[j] == obj) {
      arr.splice(j, 1);
    }
  }
}

function heuristic(a, b) {
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

function Place(x, y) {

  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.i = x;
  this.j = y;

  this.obstacle = false;

  if (random(1) > 1 - prob_of_obstacles) {
    this.obstacle = true;
  }

  this.neighbors = [];
  this.previous = undefined;

  this.addNeighbor = function(grid) {
    var i = this.i;
    var j = this.j;

    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }

  };

  this.show = function(col) {
    if (!this.obstacle) {
      stroke(0);
      fill(col);
      rect(this.i * w, this.j * w, w, w);
    } else {
      stroke(0);
      fill(100, 0, 100);
      rect(this.i * w, this.j * w, w, w);
    }
  };

}

function setup() {
  
//   start_x = floor(random(0,cols-1));
//   start_y = floor(random(0,rows-1));

//   end_x = floor(random(1,cols-1));
//   end_y = floor(random(1,rows-1));
  
  start_x = 0;
  start_y = 0;

  end_x = rows - 1;
  end_y = cols - 1;

  createCanvas(500, 500);
  w = width / rows;

  //Making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  ////Making Places
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Place(i, j);
    }
  }


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbor(grid);
    }
  }
  
  start = grid[start_x][start_y];
  end = grid[end_x][end_y];
  start.obstacle = false;
  end.obstacle = false;

  openSet.push(start);
  // console.log(current.Neighbors);
}


function draw() {

  if (openSet.length > 0) {

    //     start.h = heuristic(start,end);
    //     start.f= start.g + start.h;

    // Checking for least object with f value.
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
        // console.log(winner, i);
      }
    }
    var current = openSet[winner];

    if (current == end) {
      console.log("Done!");
      noLoop();
    }

    RemoveCurrent(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {

      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
        tent_gScore = current.g + heuristic(neighbor, current);

        var checked = false;
        if (openSet.includes(neighbor)) {
          if (tent_gScore < neighbor.g) {
            neighbor.g = tent_gScore;
            checked = true;
          }
        } else {
          neighbor.g = tent_gScore;
          checked = true;
          openSet.push(neighbor);
        }

        if (checked) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }

      path = [];
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
      
    }

    background(0);
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].show(color(255, 0, 255));
      }
    }

    for (let j = 0; j < closedSet.length; j++) {
      closedSet[j].show(color(255, 0, 0));
    }

    for (let j = 0; j < openSet.length; j++) {
      openSet[j].show(color(0, 255, 0));
    }

    for (let j = 0; j < path.length; j++) {
      path[j].show(color(255, 255, 0));
    }
    
    end.show(255);
    start.show(50);
  }
  
}
