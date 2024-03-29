angular.module('webApp')
    .service('Validate', function Validate() {
        return {
            'message': {
                'minlength': 'This value is not long enough.',
                'maxlength': 'This value is too long.',
                'email': 'Invalid email address.',
                'required': 'This field is required.'
            },
            validation_messages: function(field,form,error_bin){
                var messages = [];
                for(var e in form[field].$error){
                    if(form[field].$error[e]){
                        if(this.message[e]){
                            messages.push(this.message[e]);
                        }else{
                            messages.push("Error: " + e)
                        }
                    }
                }
                var deduped_messages = [];
                angular.forEach(messages, function(el, i){
                    if(deduped_messages.indexOf(el) === -1) deduped_messages.push(el);
                });
                if(error_bin){
                    error_bin[field] = deduped_messages;
                }
            },
            'form_validation': function(form,error_bin){
                for(var field in form){
                    if(field.substr(0,1) != "$"){
                        this.validation_messages(field,form,error_bin);
                    }
                }
            }
        }
    });