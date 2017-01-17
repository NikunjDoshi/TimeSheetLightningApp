({
    ToggleCollapseSection : function(component, event) {
        component.set("v.isCollapsed", !component.get("v.isCollapsed"));
        /*var curElement = event.currentTarget;
        var selectedState = event.currentTarget.dataset.state;
        var parElement = event.currentTarget.parentElement; 
        var stateOpen = false;
        $A.util.toggleClass(parElement,'slds-is-open');
        for (var i = 0; i < parElement.childNodes.length; i++) {
            if (parElement.childNodes[i].className && parElement.childNodes[i].className.indexOf("slds-section__content") > -1) {
                $A.util.toggleClass(parElement.childNodes[i], "slds-is-collapsed");
                $A.util.toggleClass(parElement.childNodes[i], "slds-is-expanded");
            }
        } */       
    }
})