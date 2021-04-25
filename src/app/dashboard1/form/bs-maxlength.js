$(function() {
    $('#maxlength-1').maxlength()

    $('#maxlength-2').maxlength({
        threshold: 5,
    })

    $('#maxlength-3').maxlength({
        alwaysShow: true,
    })

    $('#maxlength-4').maxlength({
        separator: ' of ',
        preText: 'You have ',
        postText: ' chars remaining.',
        validate: true
    })

    $('#maxlength-5').maxlength({ placement: 'top-right' })

    $('#maxlength-6').maxlength({ placement: 'bottom-right' })

    $('#maxlength-7').maxlength({ placement: 'top-left' })

    $('#maxlength-8').maxlength({ placement: 'bottom-left' })
})
