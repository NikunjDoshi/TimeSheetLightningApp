({
    getTimeSheet : function(cmp){
        cmp.set("v.spinner", true);
        this.callServer(cmp ,"c.getTimeSheet", function(returnValue){            
            cmp.set("v.currentTimesheet", returnValue);  
            cmp.set("v.spinner", false);
        }, { "weekOffset" : cmp.get("v.offset") * 7}, false);
        
        /*var action = cmp.get("c.getTimeSheet");
        action.setParams({ "weekOffset" : cmp.get("v.offset") * 7});        
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                cmp.set("v.currentTimesheet", response.getReturnValue());                
            } else {
                cmp.set("v.currentTimesheet", null);
            }
            cmp.set("v.spinner", false);
        });
        $A.enqueueAction(action);*/
    },
    addRow : function(cmp){
        var currentTimesheet = cmp.get("v.currentTimesheet");
        var sevenTimeEntriesPerWeek = [];
        currentTimesheet.weekDates.forEach(function(aDate) {
            sevenTimeEntriesPerWeek.push({"sobjectType" : "Time_Entry__c", "Date__c": aDate, "Task__c":""});
        });
        var entries = currentTimesheet.timeEntriesPerTask;
        entries.push({"sevenTimeEntriesPerWeek":sevenTimeEntriesPerWeek,
                      "isNew": true});
        currentTimesheet.timeEntriesPerTask = entries;
        cmp.set("v.currentTimesheet",currentTimesheet);
    },
    saveTimesheet : function(cmp){
        cmp.set("v.spinner", true);
        var currentTimesheet= cmp.get("v.currentTimesheet");
        var entriesToBeUpserted = [];
        currentTimesheet.timeEntriesPerTask.forEach(function(row) {
            row.sevenTimeEntriesPerWeek.forEach(function(aTask) {
                aTask.Task__c = row.taskId;
                if(aTask.Hours__c)
                {    
                    entriesToBeUpserted.push(aTask);
                }
            });
        }); 
        this.callServer(cmp ,"c.upsertTimeSheet", function(returnValue){            
            this.showMessage('SLDS-MSG00004',{});  
            cmp.set("v.spinner", false);
        }, { "entriesToBeUpserted" : entriesToBeUpserted}, false);
        
        
        /*var action = cmp.get("c.upsertTimeSheet");
        action.setParams({ "entriesToBeUpserted" : entriesToBeUpserted});        
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                alert('Success');
            } else {
                alert('Error '+response.getError());
                console.log(response.getError());
            }
            cmp.set("v.spinner", false);
        });
        $A.enqueueAction(action);*/
    },
    setOffset : function(cmp, offset){        
        cmp.set("v.offset", offset);
    },
    getAllRelatedProjects : function(cmp){
        
        cmp.set("v.spinner", true);  
        this.callServer(cmp ,"c.getAllRelatedProjects", function(returnValue){
            cmp.set("v.relatedProjects", returnValue);
            cmp.set("v.spinner", false);
        }, {}, false);     
        /* action.setCallback(this, function(response) {            
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                cmp.set("v.relatedProjects", response.getReturnValue());                
            } else {
                cmp.set("v.relatedProjects", null);
            }
            cmp.set("v.spinner", false);
        });
        $A.enqueueAction(action);*/
    }
})