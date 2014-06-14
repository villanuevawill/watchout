// start slingin' some d3 here.
var gameOptions = {
  height: 450,
  width: 700,
  enemies: 30,
  padding: 20
};

var gameStats = {
  high: 0,
  current: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard =
  d3.select('body').append('svg:svg')
      .attr('width', gameOptions.width)
      .attr('height', gameOptions.height);

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
    .attr('r', 10);
  enemies.exit()
    .remove();

};

var moveEnemies = function(){
  d3.selectAll('.enemy').transition().duration(1500)
    .attr('cx', function(enemy){ return axes.x(Math.random()*100); })
    .attr('cy', function(enemy){ return axes.y(Math.random()*100);});
};


var makePlayer = function(){
  var player = gameBoard.selectAll('circle')//circle.player??
                  .data([1], function(d){ return d.id; });

  var drag = d3.behavior.drag()
  .on('drag', function(){

    var playaah = d3.select('.player');
    var x = +playaah.attr('cx');
    var y = +playaah.attr('cy');
    playaah.attr('cx',d3.event.dx +x)
          .attr('cy',d3.event.dy +y);
    console.log(playaah.attr('cx'), playaah.attr('cy'));
    });

  player.enter()
    .append('svg:circle')
    .attr('class', 'player')
    .attr('cx', axes.x(50))
    .attr('cy', axes.y(50))
    .attr('r', 10)
    .call(drag);


};



render(generateEnemies());
setInterval(moveEnemies, 2000);
makePlayer();

// build gameBoard
// build enemy data next...
// invoke rendor
// WOOHOO!
