({
    callServer : function(cmp,method,callback,params,cacheable) {
        var action = cmp.get(method);
        if (params) {
            action.setParams(params);
        }
        if (cacheable) {
            action.setStorable();
        }
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                // pass returned value to callback function
                callback.call(this,response.getReturnValue());   
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                var errorMsg = '';
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        errorMsg = errors[0].message;
                    }
                } else {
                    errorMsg = "Unknown Error";
                }
                
                var mergeParamMap = {};
                mergeParamMap['MSG001'] = errorMsg;        
                this.showMessage('SLDS-MSG00002',mergeParamMap); 
                cmp.set("v.spinner", false);
            }
        });
        
        $A.enqueueAction(action);
    },
    showMessage: function(messageId, replaceJSON) {
        var event = $A.get("e.c:AddAlert");
        event.setParams({"alertId": messageId, "mergeParamMap": replaceJSON});
        event.fire();
    }
})