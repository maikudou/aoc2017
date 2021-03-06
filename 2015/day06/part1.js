var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var grid = {}

lineReader.on('line', function (line) {
  var mode = null
  if (line.indexOf('toggle') === 0) {
    line = line.substr(7)
    mode = 'toggle'
  }
  if (line.indexOf('turn off') === 0) {
    line = line.substr(9)
    mode = 'off'
  }
  if (line.indexOf('turn on') === 0) {
    line = line.substr(8)
    mode = 'on'
  }
  var coords = line.split(' through ')
  var start = coords[0].split(',')
  var end = coords[1].split(',')
  start[0] = parseInt(start[0], 10)
  start[1] = parseInt(start[1], 10)
  end[0] = parseInt(end[0], 10)
  end[1] = parseInt(end[1], 10)
  for (var j = start[0]; j <= end[0]; j++) {
    for (var k = start[1]; k <= end[1]; k++) {
      var gridName = j + '|' + k

      if (typeof grid[gridName] === 'undefined') {
        grid[gridName] = 0
      }

      switch (mode) {
        case 'toggle':
          grid[gridName] = grid[gridName] ? 0 : 1
          break
        case 'on':
          grid[gridName] = 1
          break
        case 'off':
          grid[gridName] = 0
          break
      }
    }
  }
})

lineReader.on('close', function () {
  var count = 0
  var totalCount = 0
  for (var gridName in grid) {
    totalCount++
    if (grid[gridName]) {
      count++
    }
  }
  console.log(count)
})
