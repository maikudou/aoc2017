const { Heap } = require('../../utils/Heap')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

class DateMaxHeap extends Heap {
  constructor() {
    super()
  }

  _compare(a, b) {
    return a.substr(1, 16) < b.substr(1, 16)
  }
}

var h = new DateMaxHeap()

lineReader.on('line', function (line) {
  h.insert(line)
})

var currentShift
const guards = new Map()

lineReader.on('close', function () {
  while (h.length) {
    var line = h.pop()
    var shiftBegins = / (\d\d):(\d\d)] Guard #(\d+) begins shift/.exec(line)
    var fallsAsleep = / (\d\d):(\d\d)] falls asleep/.exec(line)
    var wakesUp = / (\d\d):(\d\d)] wakes up/.exec(line)

    if (shiftBegins) {
      if (!guards.has(shiftBegins[3])) {
        guards.set(shiftBegins[3], {
          id: shiftBegins[3],
          sleptFor: 0,
          mins: new Map()
        })
      }
      currentShift = guards.get(shiftBegins[3])
    } else if (fallsAsleep) {
      currentShift.startSleep = parseInt(fallsAsleep[2])
    } else if (wakesUp) {
      currentShift.sleptFor += parseInt(wakesUp[2]) - currentShift.startSleep
      for (var i = currentShift.startSleep; i < parseInt(wakesUp[2]); i++) {
        if (currentShift.mins.has(i)) {
          currentShift.mins.set(i, currentShift.mins.get(i) + 1)
        } else {
          currentShift.mins.set(i, 1)
        }
      }
      delete currentShift.startSleep
    }
  }
  var guardsInterator = guards.values()
  var guardsNext = guardsInterator.next().value
  var maxMinSlept = 0
  var maxMinSleptNum
  var maxSleptGard

  while (guardsNext) {
    var guard = guards.get(guardsNext.id)

    var minsIterator = guard.mins.keys()
    var minNext = minsIterator.next().value
    var min
    var maxMinCount = 0
    var maxMin
    while (minNext) {
      min = guard.mins.get(minNext)
      if (min > maxMinCount) {
        maxMin = minNext
        maxMinCount = min
      }
      minNext = minsIterator.next().value
    }

    if (maxMinCount > maxMinSlept) {
      maxMinSlept = maxMinCount
      maxSleptGard = guardsNext.id
      maxMinSleptNum = maxMin
    }
    guardsNext = guardsInterator.next().value
  }

  console.log(maxSleptGard * maxMinSleptNum)
})
