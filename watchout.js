// start slingin' some d3 here.
var gameOptions = {
  height: window.innerHeight,
  width: window.innerWidth,
  enemies: 40,
  padding: 20
};

var gameStats = {
  high: 0,
  current: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard =
  d3.select('body').append('svg:svg')
      .attr('width', gameOptions.width)
      .attr('height', gameOptions.height);

var defs = gameBoard.append('svg:defs');
            defs.append('svg:pattern')
                .attr('id', 'asteroid')
                .attr('patternUnits', 'objectBoundingBox')
                .attr('width', '1')
                .attr('height', '1')
                .append('svg:image')
                .attr('xlink:href', 'asteroid.png')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width',27)
                .attr('height',27);

  defs.append('svg:pattern')
                .attr('id', 'player')
                .attr('patternUnits', 'objectBoundingBox')
                .attr('width', '1')
                .attr('height', '1')
                .append('svg:image')
                .attr('xlink:href', 'spaceship.png')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width',40)
                .attr('height',40);


var generateEnemies = function(){
  return _.range(0, gameOptions.enemies)
            .map(function(element){
              return {
                id: element,
                y: Math.random()*100,
                x: Math.random()*100
              };
            });
};

var render = function(enemy_data){
  var enemies = gameBoard.selectAll('circle')//circle.enemy??
                  .data(enemy_data, function(d){ return d.id; });
  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy){ return axes.x(enemy.x); })
    .attr('cy', function(enemy){ return axes.y(enemy.y); })
    .attr('r', 13)
    .attr('fill','url(#asteroid)');
      // .append('animateTransform')
      // .attr('attributeName','transform')
      // .attr('type','rotate')
      // .attr('begin','0s')
      // .attr('dur','2s')
      // .attr('repeatCount','indefinite');
        // <animateTransform attributeName="transform"
        //             type="rotate"
        //             // from="0 100 100" to="360 100 100"
        //             begin="0s" dur="10s"
        //             repeatCount="indefinite"
          // />
  // enemies.exit()
  //   .remove();

};

var moveEnemies = function(){
  d3.selectAll('.enemy').transition().duration(1500)
    .attr('cx', function(enemy){ return axes.x(Math.random()*100); })
    .attr('cy', function(enemy){ return axes.y(Math.random()*100);})
    .tween('custom', function(){
      var collide = 0;
      return function(){

        var playerX = +d3.select('.player').attr('cx');
        var playerY = +d3.select('.player').attr('cy');
        //tween to determine diff
        var evilX = +d3.select(this).attr('cx');
        var evilY = +d3.select(this).attr('cy');

        var x = playerX - evilX;
        var y = playerY - evilY;

        var r = Math.sqrt((x * x) + (y * y));
        // console.log(r);

        if (r < 33.5){
          // gameStats.collisions++;
          collide++;
        }
        if (collide === 1){
          //update collsions
          collide++;
          // console.log(gameStats.collisions);
          gameStats.collisions++;
          d3.select('.collisions span').text(gameStats.collisions);
        }
      };
    });
};



var makePlayer = function(){
  var player = gameBoard.selectAll('circle')//circle.player??
                  .data([1], function(d){ return d.id; });

  var drag = d3.behavior.drag()
  .on('drag', function(){

    var playaah = d3.select('.player');
    var x = +playaah.attr('cx');
    var y = +playaah.attr('cy');
    var dx = d3.event.dx;
    var dy = d3.event.dy;
    if (dx + x < gameOptions.width && dy + y < gameOptions.height
      && (dx + x > 0) && (dy + y > 0)){
    playaah.attr('cx', d3.event.dx +x)
          .attr('cy', d3.event.dy +y);
        }
    });

  player.enter()
    .append('svg:circle')
    .attr('class', 'player')
    .attr('cx', axes.x(50))
    .attr('cy', axes.y(50))
    .attr('r', 20.5)
    .attr('fill', 'url(#player)')
    .call(drag);
};
var updateScore =  function(){
  var oldCollide = gameStats.collisions;
  var temp = function(){
    gameStats.current ++;
    if (oldCollide < gameStats.collisions){
      oldCollide = gameStats.collisions;
      gameStats.current = 0;
    }
    d3.select('.current span').text(gameStats.current);
    if(gameStats.current >= gameStats.high){
      gameStats.high = gameStats.current;
      d3.select('.high span').text(gameStats.high);
    }
  };
  setInterval(temp, 100);
}




render(generateEnemies());
setInterval(moveEnemies, 2000);
updateScore();
makePlayer();

// build gameBoard
// build enemy data next...
// invoke rendor
// WOOHOO!
