"use client";
import Countdown from "react-countdown";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
export default function Timer({ targetDate }) {
  function time({ hours, minutes, seconds, completed }) {
    if (completed) {
      return (
        <span className="text-red-500 font-semibold text-xs">Try Again</span>
      );
    }
    return (
      <span className="text-red-500 font-semibold">
        <TimerOutlinedIcon />
        Try again in {hours}h {minutes}m {seconds}s
      </span>
    );
  }

  return <Countdown date={targetDate} renderer={time} />;
}
