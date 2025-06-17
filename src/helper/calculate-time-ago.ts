const CalculateTimeAgo = (timestamp: string): string => {
    const givenTime = new Date(timestamp);
    const currentTime = new Date();

    // Reduce 5 hours (5 * 60 * 60 * 1000 milliseconds) from the given timestamp
    givenTime.setTime(givenTime.getTime() + 5 * 60 * 60 * 1000);

    const diffMilliseconds = currentTime.getTime() - givenTime.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000); // Convert to seconds
    const diffMinutes = Math.floor(diffSeconds / 60); // Convert to minutes

    if (diffMinutes >= 1440) {
      // 1440 minutes in a day
      const days = Math.floor(diffMinutes / 1440); // Convert minutes to days
      return `${days} d`;
    } else if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60); // Convert minutes to hours
      return `${hours} h`;
    } else if (diffSeconds >= 60) {
      return `${diffMinutes} m`;
    } else {
      return `${diffSeconds} s`;
    }
  };

export default CalculateTimeAgo;