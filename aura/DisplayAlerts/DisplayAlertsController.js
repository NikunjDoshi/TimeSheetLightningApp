({
	doInit : function(component, event, helper) {
		helper.getAllAlerts(component);
	},
    addAlertAction : function(component, event, helper) {
        helper.addAlertAction(component, event);
	},
    removeAlert : function(component, event, helper) {
        helper.removeAlert(component, event);
	} 
})