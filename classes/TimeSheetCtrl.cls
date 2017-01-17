public class TimeSheetCtrl {
    @auraEnabled
    public static TimeSheetPerWeek getTimeSheet(Integer weekOffset){
        Date startDate = system.today();
        system.debug('weekOffset '+weekOffset);
        startDate = startDate.addDays(Integer.valueOf(weekOffset));
        if(startDate == null) startDate = system.today().tostartofweek();
        TimeSheetPerWeek timeSheet = new TimeSheetPerWeek();
        timeSheet.startDate = startDate;
        timeSheet.displayDates =  new List<String>();
        Datetime startOfWeek = datetime.newInstance(startDate.year(), startDate.month(),startDate.day());
        timeSheet.weekDates = new List<Date>();
        List<String> daysInAWeek = new List<String>{'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'};
            if(startOfWeek.format('EEEE')=='Sunday') startDate = startDate.addDays(1);
        Date weekDate = startDate;
        for(integer i=0; i<7; i++){
            timeSheet.displayDates.add(daysInAWeek.get(i)+'('+weekDate.month()+'/'+weekDate.day()+')');
            timeSheet.weekDates.add(weekDate);
            weekDate = weekDate.addDays(1);
        }
        List<TimeEntriesPerWeekPerTask> timeEntriesPerTask = new List<TimeEntriesPerWeekPerTask>();
        Map<String, TimeEntriesPerWeekPerTask> taskNameToTimeEntries = 
            new Map<String, TimeEntriesPerWeekPerTask>();
        //Key ==> ProjectName TaskName TaskCategoru
        Map<String, Map<Date, Time_Entry__c>> keyToTimeEntries = new Map<String, Map<Date, Time_Entry__c>>();
        Map<String, Task__c> keyToTask = new Map<String, Task__c>();
        for(Time_Entry__c aTimeEntry: [Select Id, Hours__c, Notes__c, Date__c, User__c, Status__c,
                                       Task__c, Display_Name__c, Task__r.name, Task__r.Display_Name__c, Task__r.category__c, Task__r.Project__r.name, Task__r.Project__c
                                       from Time_Entry__c where Date__c >= :timesheet.weekDates[0] and
                                       Date__c<=:timesheet.weekDates[6]
                                       and User__c=: userInfo.getUserId() order by Task__r.Project__r.name]){
                                           String key = aTimeEntry.Task__r.Project__r.name + '_' + aTimeEntry.Task__r.name
                                               + '_' + aTimeEntry.Task__r.category__c;
                                           keyToTask.put(key, aTimeEntry.Task__r);  
                                           if(!keyToTimeEntries.containsKey(key))
                                               keyToTimeEntries.put(key, new Map<Date, Time_Entry__c>());                                           
                                           keyToTimeEntries.get(key).put(aTimeEntry.Date__c, aTimeEntry);
                                       }
        for(String key: keyToTimeEntries.keySet()){    
            TimeEntriesPerWeekPerTask tePerWeek = new TimeEntriesPerWeekPerTask();
            Task__c relatedTask = keyToTask.get(key);
            List<Time_Entry__c> sevenTimeEntriesPerWeek = new List<Time_Entry__c>();            
            for(Date aWeekDate: timeSheet.weekDates){
                Map<Date, Time_Entry__c> entries = keyToTimeEntries.get(key);
                if(entries.containsKey(aWeekDate))sevenTimeEntriesPerWeek.add(entries.get(aWeekDate));
                else sevenTimeEntriesPerWeek.add(new Time_Entry__c());
            }
            system.debug('sevenTimeEntriesPerWeek '+sevenTimeEntriesPerWeek);
            tePerWeek.sevenTimeEntriesPerWeek = sevenTimeEntriesPerWeek;
            tePerWeek.isNew = false;
            tePerWeek.rowName = relatedTask.Display_Name__c;
            tePerWeek.taskId = relatedTask.Id;
            timeEntriesPerTask.add(tePerWeek); 
        } 
        timeSheet.timeEntriesPerTask = timeEntriesPerTask;
        return timeSheet;
    }
    
    @auraEnabled
    public static List<Project2__c> getAllRelatedProjects(){
        return [Select Name, (Select Id, Category__c, Name from Project_Tasks__r) from Project2__c where id in
                (Select Project__c from Project_Member__c where Member__c=:userinfo.getUserId() and active__c = true)];
    }
    
    @auraEnabled
    public static void upsertTimeSheet(List<Time_Entry__c> entriesToBeUpserted){
        List<Time_Entry__c> entriesToBeUpsertedNew = new List<Time_Entry__c>();
        for(Time_Entry__c te :entriesToBeUpserted){
            if(te.User__c == null)te.User__c = UserInfo.getUserId();
            entriesToBeUpsertedNew.add(te);
        }
        upsert entriesToBeUpsertedNew;
    }
}