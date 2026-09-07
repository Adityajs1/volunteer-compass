import { RRule, rrulestr } from 'rrule';

/**
 * Validates if a given string is a valid RFC 5545 RRULE
 */
export const isValidRRule = (ruleString: string): boolean => {
  try {
    rrulestr(ruleString);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Generates the next N occurrences based on an RRULE string and an event start date
 */
export const getNextOccurrences = (
  ruleString: string,
  startDate: Date,
  count: number = 5
): Date[] => {
  try {
    const options = RRule.parseString(ruleString);
    options.dtstart = startDate;
    const rule = new RRule(options);
    
    // Get next occurrences from now
    const now = new Date();
    // Use an arbitrary end date 5 years from now to cap the search if needed
    const maxEndDate = new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);
    
    return rule.between(now, maxEndDate, true, (_d, i) => i < count);
  } catch (error) {
    console.error('Error computing next occurrences:', error);
    return [];
  }
};

/**
 * Checks if a specific date and time matches the recurrence rule
 */
export const isDateInRecurrence = (ruleString: string, startDate: Date, dateToCheck: Date): boolean => {
  try {
    const options = RRule.parseString(ruleString);
    options.dtstart = startDate;
    const rule = new RRule(options);
    
    // Check occurrences within the whole day of dateToCheck
    const checkStart = new Date(dateToCheck);
    checkStart.setHours(0, 0, 0, 0);
    
    const checkEnd = new Date(dateToCheck);
    checkEnd.setHours(23, 59, 59, 999);
    
    const occurrences = rule.between(checkStart, checkEnd, true);
    return occurrences.length > 0;
  } catch (error) {
    return false;
  }
};
