module.exports =
  function Player(id, firstName, lastName, nickName, handicap) {
    this.id = id || '';
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.nickName = nickName || '';
    this.handicap = handicap || 0
    this.adjustHandicap = function(value) {
      if (typeof value === number) {
        this.handicap = value
      }
    }
  }
