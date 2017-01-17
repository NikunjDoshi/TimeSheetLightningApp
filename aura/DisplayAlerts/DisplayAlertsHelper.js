({
    getAllAlerts : function(component) {
        var action = component.get("c.getAllAlerts");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {		
                component.set("v.allAlertWrappers", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);          
    },
    addAlertAction : function(component, event){
        debugger;
        var alertId = event.getParam("alertId");
        var allAlertWrappers = component.get("v.allAlertWrappers");
        var key;
        var addedAlertIds = component.get("v.addedAlertIds");
        var successAlert;
        var infoAlert;
        var errorAlert;
        var warningAlert;
        for(key in allAlertWrappers){
            if(key == alertId && addedAlertIds.indexOf(alertId)== -1){ 
                addedAlertIds.push(alertId);
                var addAlert = allAlertWrappers[key];                
                console.log(JSON.stringify(addAlert));
                if(addAlert.alertType == 'Success')
                    successAlert = addAlert;
                else if(addAlert.alertType == 'Warning')
                    warningAlert = addAlert;
                    else if(addAlert.alertType == 'Information')
                        infoAlert = addAlert;
                        else if(addAlert.alertType == 'Error')
                            errorAlert = addAlert;  
            }            
        }
        var mergeParamMap = event.getParam("mergeParamMap");
        for (key in mergeParamMap) {
            var value =  mergeParamMap[key];
           if(successAlert)successAlert.alertMessage = successAlert.alertMessage.replace(key, value);
           if(errorAlert)errorAlert.alertMessage = errorAlert.alertMessage.replace(key, value);
           if(infoAlert)infoAlert.alertMessage = infoAlert.alertMessage.replace(key, value);
           if(warningAlert)errorAlert.alertMessage = warningAlert.alertMessage.replace(key, value);
        }
        if(successAlert){
            var existingSuccessAlerts = component.get("v.successAlerts");
            existingSuccessAlerts.push(successAlert);
            component.set("v.successAlerts", existingSuccessAlerts);
        }
        if(errorAlert){
            var existingErrorAlerts = component.get("v.errorAlerts");
            existingErrorAlerts.push(errorAlert);
            component.set("v.errorAlerts", existingErrorAlerts);
        }
        if(infoAlert){
            var existingInfoAlerts = component.get("v.infoAlerts");
            existingInfoAlerts.push(infoAlert);
            component.set("v.infoAlerts", existingInfoAlerts);
        }
        if(warningAlert){
            var existingWarningAlerts = component.get("v.warningAlerts");
            existingWarningAlerts.push(warningAlert);
            component.set("v.warningAlerts", existingWarningAlerts);
        }
    },
    removeAlert: function(component, event){
        var selectedItem = event.currentTarget;
        var removeAlertId = selectedItem.dataset.alertid;
        
        var index = selectedItem.dataset.index;
        var addedAlertIds = component.get("v.addedAlertIds");
        addedAlertIds.splice(addedAlertIds.indexOf(removeAlertId), 1);
        component.set("v.addedAlertIds", addedAlertIds);
        var alertBox = event.currentTarget.parentElement;
        $A.util.toggleClass(alertBox, 'slds-hide');
    }
})