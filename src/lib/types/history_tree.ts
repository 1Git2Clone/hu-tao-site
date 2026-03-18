export type Year = number;
export type Month = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

export type MonthlyAchievements = {
  name: Month
  tasks: string[]
};

export type History = {
  year: Year;
  months: MonthlyAchievements[]
}
