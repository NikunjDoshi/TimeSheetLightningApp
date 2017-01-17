public class TimeEntriesPerWeekPerTask {
    @auraEnabled public List<Time_Entry__c> sevenTimeEntriesPerWeek{get; set;}
    @auraEnabled public String taskId{get; set;}
    @auraEnabled public String rowName{get; set;}
    @auraEnabled public Boolean isNew{get; set;}
}