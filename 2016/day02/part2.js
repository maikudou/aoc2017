var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const input = []

lineReader.on('line', function (line) {
  input.push(line)
})

lineReader.on('close', function () {
  var current = 5
  var digits = []
  var line
  var x = 0
  var y = 2

  var matrix = [
    [0, 0, 1, 0, 0],
    [0, 2, 3, 4, 0],
    [5, 6, 7, 8, 9],
    [0, 'A', 'B', 'C', 0],
    [0, 0, 'D', 0, 0]
  ]

  for (var i = 0; i < input.length; i++) {
    line = input[i]
    for (var j = 0; j < line.length; j++) {
      switch (line[j]) {
        case 'L':
          if (x > 0 && matrix[y][x - 1]) {
            current = matrix[y][x - 1]
            x--
          }
          break
        case 'R':
          if (x < 4 && matrix[y][x + 1]) {
            current = matrix[y][x + 1]
            x++
          }
          break
        case 'U':
          if (y > 0 && matrix[y - 1][x]) {
            current = matrix[y - 1][x]
            y--
          }
          break
        case 'D':
          if (y < 4 && matrix[y + 1][x]) {
            current = matrix[y + 1][x]
            y++
          }
          break
      }
    }
    digits.push(current)
  }

  console.log(digits.join(''))
})
