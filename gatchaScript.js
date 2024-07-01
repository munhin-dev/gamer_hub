const gachaSystem = {
  MAX_TOTAL_COUNT: 90,
  MAX_FOUR_STAR_COUNT: 10,
  FIVE_STAR_THRESHOLD: 0.6,
  FOUR_STAR_THRESHOLD: 5.1,
  SECOND_NUMBER_THRESHOLD: 50,
  totalCount: 0,
  fourStarCount: 0,
  getRandomInt(max = 100) {
    return (Math.random() * max).toFixed(2);
  },
  attemptRoll() {
    this.totalCount++;
    const number = parseFloat(this.getRandomInt());
    let dynamicFiveStarThreshold = this.FIVE_STAR_THRESHOLD;

    if (this.totalCount >= 76 && this.totalCount < this.MAX_TOTAL_COUNT) {
      const increaseFactor = (this.totalCount - 75) * 10; // Increase by 10% for each pull from 76 to 90
      dynamicFiveStarThreshold = Math.min(100, this.FIVE_STAR_THRESHOLD + increaseFactor);
    }

    if (this.totalCount === this.MAX_TOTAL_COUNT) {
      console.log("You are guaranteed a 5 star character, totalCount: ", this.totalCount);
      this.totalCount = 0;
      this.fourStarCount = 0;
    } else if (this.totalCount % 10 === 0 && this.fourStarCount === 0) {
      console.log("You are guaranteed a 4 star character, totalCount: ", this.totalCount);
      this.fourStarCount = 0;
    } else if (number <= dynamicFiveStarThreshold || this.totalCount >= 76) {
      const secondNumber = parseFloat(this.getRandomInt());
      if (secondNumber <= this.SECOND_NUMBER_THRESHOLD) {
        console.log("You got a 5 star banner character, totalCount: ", this.totalCount);
      } else {
        console.log("You got a 5 star standard character, totalCount: ", this.totalCount);
      }
      this.totalCount = 0;
      this.fourStarCount = 0;
    } else if (number <= this.FOUR_STAR_THRESHOLD || this.totalCount % 10 === 0) {
      const secondNumber = parseFloat(this.getRandomInt());
      if (secondNumber <= this.SECOND_NUMBER_THRESHOLD) {
        console.log("You got a 4 star character, totalCount: ", this.totalCount);
      } else {
        console.log("You got a 4 star weapon, totalCount: ", this.totalCount);
      }
      this.fourStarCount = 0;
    } else {
      console.log("You got a common weapon");
      this.fourStarCount++;
    }
  },
  attemptRolls(count = 10) {
    for (let i = 0; i < count; i++) {
      this.attemptRoll();
    }
  },
};

gachaSystem.attemptRolls(100);
