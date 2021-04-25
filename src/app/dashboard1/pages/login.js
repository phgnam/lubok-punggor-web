$(function() {
    // Initialize form validation
    $('#login-form').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            email: {
                required: 'Please enter your email',
                email: 'Your email is not valid'
            },
            password: {
                required: 'Please provide your password',
                minlength: $.validator.format('Please enter at least {0} characters') // Format validation message
            }
        },
        submitHandler: form => {
            form.submit() // Submit form
        }
    })
})
