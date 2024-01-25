import dotenv from "dotenv"
import server from "./server.js"

Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

Date.prototype.minutesDiff = function (timeToCompare) {
    var differenceValue = (this.getTime() - timeToCompare.getTime()) / 1000;
    differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
}

dotenv.config()
server();