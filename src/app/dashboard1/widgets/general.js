$(function() {
    $('#widget-carousel').slick({
        rtl: $('html').attr('dir') === 'rtl', // Carousel direction
        asNavFor: '#widget-carousel-nav', // Make this carousel as navigation for #widget-carousel-nav carousel
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    })

    $('#widget-carousel-nav').slick({
        rtl: $('html').attr('dir') === 'rtl', // Carousel direction
        asNavFor: '#widget-carousel', // Make this carousel as navigation for #widget-carousel carousel
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true
    })
})
