({
	doInit : function(component, event, helper) {
		helper.setOffset(component, "-1");
        helper.getAllRelatedProjects(component);
	},
    addRow : function(component, event, helper) {
		helper.addRow(component);
	},
    saveTimesheet : function(component, event, helper) {
		helper.saveTimesheet(component);
	},
    goToPrevWeek : function(component, event, helper) {
		helper.setOffset(component, component.get("v.offset")-1);
	},
    goToNextWeek : function(component, event, helper) {
		helper.setOffset(component, component.get("v.offset")+1);
	},
    getTimeSheetOnChange  : function(component, event, helper) {
		helper.getTimeSheet(component);
	}
})