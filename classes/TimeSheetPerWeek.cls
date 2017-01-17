public class TimeSheetPerWeek {
	@auraEnabled public Date startDate{get; set;}
    @auraEnabled public List<TimeEntriesPerWeekPerTask> timeEntriesPerTask{get; set;}    
    @auraEnabled public List<String> displayDates{get; set;}
    @auraEnabled public List<Date> weekDates{get;set;}
}