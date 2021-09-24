/* eslint-disable no-undef */
//header 

var scrollPos = 0;
$(window).scroll(function(){
	var st = $(this).scrollTop();

	$('.header.top').addClass('sticky');
	
	if (($(window).scrollTop() - scrollPos) < -18) {
		$('.header.top').addClass('fixed');
	} 
	else if (st > scrollPos) {
		$('.header.top').removeClass('fixed');
	}
	if($(window).scrollTop() < 5) {
		$('.header.top').removeClass('sticky fixed');
	}
	scrollPos = st;
});

//slider 
$('#slider__bunner').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots: true,
	autoplay: true,
	autoplaySpeed: 5000,
});

$('.slider__products').slick({
	slidesToShow: 5,
	slidesToScroll: 5,
	arrows: true,
	dots: false,
	infinite: false,

	responsive: [
		{
			breakpoint: 1231,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4,
			}
		},
		{
			breakpoint: 961,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
			}
		},
		{
			breakpoint: 481,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			}
		},
	]
});

$('.gallery__items').slick({
	slidesToShow: 11,
	slidesToScroll: 11,
	infinite: false,
	arrows: true,

	responsive: [
		{
			breakpoint: 1441,
			settings: {
				slidesToShow: 9,
				slidesToScroll: 9,
			}
		},
		{
			breakpoint: 1231,
			settings: {
				slidesToShow: 7,
				slidesToScroll: 7,
			}
		},
		{
			breakpoint: 961,
			settings: {
				slidesToShow: 6,
				slidesToScroll: 6,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 5,
			}
		},
		{
			breakpoint: 577,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4,
			}
		},
		{
			breakpoint: 481,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
			}
		},
		{
			breakpoint: 381,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
			}
		},
	]
});

$('.overview__slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	dots: false,
	arrows: true,
	
	responsive: [
		{
			breakpoint: 961,
			settings: {
				vertical: false,
				centerPadding: 0,
			}
		},
		{
			breakpoint: 700,
			settings: {
				vertical: false,
				centerPadding: 0,
				slidesToShow: 1,
			}
		},
	]
});

$('.gallery__item').on('click', function(e) {
	e.preventDefault();
	let href = $(this).attr('href');
	
	$('.fineart__overview-items').removeClass('active').slick('unslick');
	$(href).addClass('active').slick();
});

/*___*/

$('.about_info_images').slick({
	arrows: false,
	dots: true,
	infinite: false,
	slidesToShow: 1
});

$('.cabinet_blocks').slick({
	infinite: false,
    slidesToShow: 1,
    dots: true,
    adaptiveHeight: true,
    draggable: false,
    swipe: false,
    arrows: false,
    waitForAnimate: false
});

//menu
$('.header__burger').on('click', function(){
	$(this).toggleClass('active')
	$('.header__block-wrap').slideToggle(250).toggleClass('active');
	$('html').toggleClass('hidden');
});

//User
$('.header__user').on('click', function() {
	$('.header__user-toolbar').slideToggle(0);
});

//aside
$('.artist .aside__heading').on('click', function(){
	$(this).addClass('active')
	$('.artist, .artist__list').addClass('active');
});

$('.artist__list-close').on('click', function(){
	$('.artist').removeClass('active');
	$('.artist__list').removeClass('active');
});


//Dropdown
$('.item-info__icon').on('click', function() {
	$(this).toggleClass('close').next('.item-info__dropdown').toggleClass('active');
	$(this).parent().parent('label').toggleClass('active');
});

$(document).mouseup(function (e){
    let dropdown = $('.item-info__dropdown');
    if (!dropdown.is(e.target) 
        && dropdown.has(e.target).length === 0) {
        if (!$(e.target).hasClass('flaticon-letter-x')) {
            $('.item-info__icon').removeClass('close');
            dropdown.removeClass('active');
            $('.item-info__icon').parent().parent('label').toggleClass('active');
        }
    }
});

//Aside
$('.artist__item').on('click', function() {
	$(this).toggleClass('active').find('.artist__sublist').slideToggle(250);
});

//Popup
$(document).ready(function(){
	$('a.open_connect').magnificPopup({
		items: [
			{
				src: '.popup__connect',
				type: 'inline'
			}
		],
	});
	$('a.open_terms').magnificPopup({
		items: [
			{
				src: '.popup__terms',
				type: 'inline'
			}
		],
	});
	$('a.open_bid').magnificPopup({
		items: [
			{
				src: '.popup__bid',
				type: 'inline'
			}
		],
	});

	$('.product__image-resize').magnificPopup({
		type : 'image',		
	});
});

//buttons fill
$('body').on('mouseenter', '.button .btn_fill', function(){
	$(this).removeClass('fill');
	$(this).next('.btn_blank').addClass('fill');
	$(this).prev('.btn_blank').addClass('fill');
});
$('body').on('mouseleave', '.button .btn_fill', function(){
	$(this).addClass('fill');
	$(this).next('.btn_blank').removeClass('fill');
	$(this).prev('.btn_blank').removeClass('fill');
});
$('body').on('mouseenter', '.button .btn_blank', function(){
	$(this).addClass('fill');
	$(this).next('.btn_fill').removeClass('fill');
	$(this).prev('.btn_fill').removeClass('fill');
});
$('body').on('mouseleave', '.button .btn_blank', function(){
	$(this).removeClass('fill');
	$(this).next('.btn_fill').addClass('fill');
	$(this).prev('.btn_fill').addClass('fill');
});

$('.item-stats__favorites, .item-stats__likes').on('click', function(){
	$(this).toggleClass('active');
});

//Select
$('select').styler();


/*___*/

// Dropdown

$(document).on('click', '.faq_article_dropdown_li span', function () {
	var e = $(this),
		info = e.parent().find('.faq_article_dropdown_info');

		if (e.hasClass('active')) {
			close();

			e.removeClass('active');
			info.slideUp();
		} else {
			faq_close();

			e.addClass('active');
			info.slideDown();
		}
});

function faq_close() {
	$('.faq_article_dropdown_li span').removeClass('active');
	$('.faq_article_dropdown_info').slideUp();
}

// Play/stop

$(document).on('click', '.video', function(){
	let e = $(this),
		active = e.hasClass('stop'),
		video = e.find('video');

	e.removeClass('stop');
	video.prop('controls', true);
	video.get(0).play(); 

	if (active == false) {
		e.addClass('stop');
		video.get(0).pause(); 
		video.prop('controls', false);
	}
});

// Cabinet navigation

$(document).on('click', '.cabinet_nav_li', function () {
    let e = $(this);

    $('.cabinet_nav_li').removeClass('active');
    e.addClass('active');
});

// Copy

$(document).on('click', '.cabinet_top_user_link', function () {
	var e = $(this),
		val = e.text(),
		f = $('<input>');

	e.toggleClass('icon-copy icon-copy_fill')

	$('body').append(f);
	f.val(val).select();
	document.execCommand('copy');
	f.remove();

	setTimeout(function() {
		e.toggleClass('icon-copy icon-copy_fill')
	}, 1000);
});

// Create check

$(document).ready(function () {
	$('.create_check.inactive .create_check_info').slideUp();
})

$(document).on('click', '.create_check.inactive label', function () {
	$('.create_check.active').toggleClass('active inactive').find('.create_check_info').slideUp().find('input').val('');
	$(this).parent().toggleClass('active inactive').find('.create_check_info').slideDown();
})

// Datapiker
/*
	Закоментировал выдавало ошибку
$( function() {
    $('.datepicker').datepicker();
}); */


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vaGVhZGVyIFxyXG52YXIgc2Nyb2xsUG9zID0gMDtcclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xyXG5cdHZhciBzdCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdCQoJy5oZWFkZXIudG9wJykuYWRkQ2xhc3MoJ3N0aWNreScpO1xyXG5cdFxyXG5cdGlmICgoJCh3aW5kb3cpLnNjcm9sbFRvcCgpIC0gc2Nyb2xsUG9zKSA8IC0xOCkge1xyXG5cdFx0JCgnLmhlYWRlci50b3AnKS5hZGRDbGFzcygnZml4ZWQnKTtcclxuXHR9IFxyXG5cdGVsc2UgaWYgKHN0ID4gc2Nyb2xsUG9zKSB7XHJcblx0XHQkKCcuaGVhZGVyLnRvcCcpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG5cdH1cclxuXHRpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPCA1KSB7XHJcblx0XHQkKCcuaGVhZGVyLnRvcCcpLnJlbW92ZUNsYXNzKCdzdGlja3kgZml4ZWQnKTtcclxuXHR9XHJcblx0c2Nyb2xsUG9zID0gc3Q7XHJcbn0pO1xyXG5cclxuLy9zbGlkZXIgXHJcbiQoJyNzbGlkZXJfX2J1bm5lcicpLnNsaWNrKHtcclxuXHRzbGlkZXNUb1Nob3c6IDEsXHJcblx0c2xpZGVzVG9TY3JvbGw6IDEsXHJcblx0YXJyb3dzOiBmYWxzZSxcclxuXHRkb3RzOiB0cnVlLFxyXG5cdGF1dG9wbGF5OiB0cnVlLFxyXG5cdGF1dG9wbGF5U3BlZWQ6IDUwMDAsXHJcbn0pO1xyXG5cclxuJCgnLnNsaWRlcl9fcHJvZHVjdHMnKS5zbGljayh7XHJcblx0c2xpZGVzVG9TaG93OiA1LFxyXG5cdHNsaWRlc1RvU2Nyb2xsOiA1LFxyXG5cdGFycm93czogdHJ1ZSxcclxuXHRkb3RzOiBmYWxzZSxcclxuXHRpbmZpbml0ZTogZmFsc2UsXHJcblxyXG5cdHJlc3BvbnNpdmU6IFtcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDEyMzEsXHJcblx0ICAgICAgc2V0dGluZ3M6IHtcclxuXHQgICAgICBcdHNsaWRlc1RvU2hvdzogNCxcclxuXHQgICAgICBcdHNsaWRlc1RvU2Nyb2xsOiA0LFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDk2MSxcclxuXHQgICAgICBzZXR0aW5nczoge1xyXG5cdCAgICAgIFx0c2xpZGVzVG9TaG93OiAzLFxyXG5cdCAgICAgIFx0c2xpZGVzVG9TY3JvbGw6IDMsXHJcblx0ICAgICAgfVxyXG5cdCAgICB9LFxyXG5cdCAgICB7XHJcblx0ICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG5cdCAgICAgIHNldHRpbmdzOiB7XHJcblx0ICAgICAgXHRzbGlkZXNUb1Nob3c6IDIsXHJcblx0ICAgICAgXHRzbGlkZXNUb1Njcm9sbDogMixcclxuXHQgICAgICB9XHJcblx0ICAgIH0sXHJcblx0ICAgIHtcclxuXHQgICAgICBicmVha3BvaW50OiA0ODEsXHJcblx0ICAgICAgc2V0dGluZ3M6IHtcclxuXHQgICAgICBcdHNsaWRlc1RvU2hvdzogMSxcclxuXHQgICAgICBcdHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHRdXHJcbn0pO1xyXG5cclxuJCgnLmdhbGxlcnlfX2l0ZW1zJykuc2xpY2soe1xyXG5cdHNsaWRlc1RvU2hvdzogMTEsXHJcblx0c2xpZGVzVG9TY3JvbGw6IDExLFxyXG5cdGluZmluaXRlOiBmYWxzZSxcclxuXHRhcnJvd3M6IHRydWUsXHJcblxyXG5cdHJlc3BvbnNpdmU6IFtcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDE0NDEsXHJcblx0ICAgICAgc2V0dGluZ3M6IHtcclxuXHQgICAgICBcdHNsaWRlc1RvU2hvdzogOSxcclxuXHQgICAgICBcdHNsaWRlc1RvU2Nyb2xsOiA5LFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDEyMzEsXHJcblx0ICAgICAgc2V0dGluZ3M6IHtcclxuXHQgICAgICBcdHNsaWRlc1RvU2hvdzogNyxcclxuXHQgICAgICBcdHNsaWRlc1RvU2Nyb2xsOiA3LFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDk2MSxcclxuXHQgICAgICBzZXR0aW5nczoge1xyXG5cdCAgICAgIFx0c2xpZGVzVG9TaG93OiA2LFxyXG5cdCAgICAgIFx0c2xpZGVzVG9TY3JvbGw6IDYsXHJcblx0ICAgICAgfVxyXG5cdCAgICB9LFxyXG5cdCAgICB7XHJcblx0ICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG5cdCAgICAgIHNldHRpbmdzOiB7XHJcblx0ICAgICAgXHRzbGlkZXNUb1Nob3c6IDUsXHJcblx0ICAgICAgXHRzbGlkZXNUb1Njcm9sbDogNSxcclxuXHQgICAgICB9XHJcblx0ICAgIH0sXHJcblx0ICAgIHtcclxuXHQgICAgICBicmVha3BvaW50OiA1NzcsXHJcblx0ICAgICAgc2V0dGluZ3M6IHtcclxuXHQgICAgICBcdHNsaWRlc1RvU2hvdzogNCxcclxuXHQgICAgICBcdHNsaWRlc1RvU2Nyb2xsOiA0LFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDQ4MSxcclxuXHQgICAgICBzZXR0aW5nczoge1xyXG5cdCAgICAgIFx0c2xpZGVzVG9TaG93OiAzLFxyXG5cdCAgICAgIFx0c2xpZGVzVG9TY3JvbGw6IDMsXHJcblx0ICAgICAgfVxyXG5cdCAgICB9LFxyXG5cdCAgICB7XHJcblx0ICAgICAgYnJlYWtwb2ludDogMzgxLFxyXG5cdCAgICAgIHNldHRpbmdzOiB7XHJcblx0ICAgICAgXHRzbGlkZXNUb1Nob3c6IDIsXHJcblx0ICAgICAgXHRzbGlkZXNUb1Njcm9sbDogMixcclxuXHQgICAgICB9XHJcblx0ICAgIH0sXHJcblx0XVxyXG59KTtcclxuXHJcbiQoJy5vdmVydmlld19fc2xpZGVyJykuc2xpY2soe1xyXG5cdHNsaWRlc1RvU2hvdzogMSxcclxuXHRzbGlkZXNUb1Njcm9sbDogMSxcclxuXHRkb3RzOiBmYWxzZSxcclxuXHRhcnJvd3M6IHRydWUsXHJcblx0XHJcblx0cmVzcG9uc2l2ZTogW1xyXG5cdCAgICB7XHJcblx0ICAgICAgYnJlYWtwb2ludDogOTYxLFxyXG5cdCAgICAgIHNldHRpbmdzOiB7XHJcblx0ICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcblx0ICAgICAgICBjZW50ZXJQYWRkaW5nOiAwLFxyXG5cdCAgICAgIH1cclxuXHQgICAgfSxcclxuXHQgICAge1xyXG5cdCAgICAgIGJyZWFrcG9pbnQ6IDcwMCxcclxuXHQgICAgICBzZXR0aW5nczoge1xyXG5cdCAgICAgIFx0dmVydGljYWw6IGZhbHNlLFxyXG5cdCAgICAgICAgY2VudGVyUGFkZGluZzogMCxcclxuXHQgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuXHQgICAgICB9XHJcblx0ICAgIH0sXHJcblx0XVxyXG59KTtcclxuXHJcbiQoJy5nYWxsZXJ5X19pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRsZXQgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cdFxyXG5cdCQoJy5maW5lYXJ0X19vdmVydmlldy1pdGVtcycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKS5zbGljaygndW5zbGljaycpO1xyXG5cdCQoaHJlZikuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNsaWNrKCk7XHJcbn0pO1xyXG5cclxuLypfX18qL1xyXG5cclxuJCgnLmFib3V0X2luZm9faW1hZ2VzJykuc2xpY2soe1xyXG5cdGFycm93czogZmFsc2UsXHJcblx0ZG90czogdHJ1ZSxcclxuXHRpbmZpbml0ZTogZmFsc2UsXHJcblx0c2xpZGVzVG9TaG93OiAxXHJcbn0pO1xyXG5cclxuJCgnLmNhYmluZXRfYmxvY2tzJykuc2xpY2soe1xyXG5cdGluZmluaXRlOiBmYWxzZSxcclxuICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgIGRvdHM6IHRydWUsXHJcbiAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICBzd2lwZTogZmFsc2UsXHJcbiAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgd2FpdEZvckFuaW1hdGU6IGZhbHNlXHJcbn0pO1xyXG5cclxuLy9tZW51XHJcbiQoJy5oZWFkZXJfX2J1cmdlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0JCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJylcclxuXHQkKCcuaGVhZGVyX19ibG9jay13cmFwJykuc2xpZGVUb2dnbGUoMjUwKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0JCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcclxufSk7XHJcblxyXG4vL1VzZXJcclxuJCgnLmhlYWRlcl9fdXNlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdCQoJy5oZWFkZXJfX3VzZXItdG9vbGJhcicpLnNsaWRlVG9nZ2xlKDApO1xyXG59KTtcclxuXHJcbi8vYXNpZGVcclxuJCgnLmFydGlzdCAuYXNpZGVfX2hlYWRpbmcnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0JCgnLmFydGlzdCwgLmFydGlzdF9fbGlzdCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxufSk7XHJcblxyXG4kKCcuYXJ0aXN0X19saXN0LWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHQkKCcuYXJ0aXN0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdCQoJy5hcnRpc3RfX2xpc3QnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbn0pO1xyXG5cclxuXHJcbi8vRHJvcGRvd25cclxuJCgnLml0ZW0taW5mb19faWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2Nsb3NlJykubmV4dCgnLml0ZW0taW5mb19fZHJvcGRvd24nKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0JCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoJ2xhYmVsJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24gKGUpe1xyXG4gICAgbGV0IGRyb3Bkb3duID0gJCgnLml0ZW0taW5mb19fZHJvcGRvd24nKTtcclxuICAgIGlmICghZHJvcGRvd24uaXMoZS50YXJnZXQpIFxyXG4gICAgICAgICYmIGRyb3Bkb3duLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgaWYgKCEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZmxhdGljb24tbGV0dGVyLXgnKSkge1xyXG4gICAgICAgICAgICAkKCcuaXRlbS1pbmZvX19pY29uJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIGRyb3Bkb3duLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLml0ZW0taW5mb19faWNvbicpLnBhcmVudCgpLnBhcmVudCgnbGFiZWwnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vQXNpZGVcclxuJCgnLmFydGlzdF9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpLmZpbmQoJy5hcnRpc3RfX3N1Ymxpc3QnKS5zbGlkZVRvZ2dsZSgyNTApO1xyXG59KTtcclxuXHJcbi8vUG9wdXBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKCdhLm9wZW5fY29ubmVjdCcpLm1hZ25pZmljUG9wdXAoe1xyXG5cdFx0aXRlbXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNyYzogJy5wb3B1cF9fY29ubmVjdCcsXHJcblx0XHRcdFx0dHlwZTogJ2lubGluZSdcclxuXHRcdFx0fVxyXG5cdFx0XSxcclxuXHR9KTtcclxuXHQkKCdhLm9wZW5fdGVybXMnKS5tYWduaWZpY1BvcHVwKHtcclxuXHRcdGl0ZW1zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcmM6ICcucG9wdXBfX3Rlcm1zJyxcclxuXHRcdFx0XHR0eXBlOiAnaW5saW5lJ1xyXG5cdFx0XHR9XHJcblx0XHRdLFxyXG5cdH0pO1xyXG5cdCQoJ2Eub3Blbl9lcnJvcicpLm1hZ25pZmljUG9wdXAoe1xyXG5cdFx0aXRlbXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNyYzogJy5wb3B1cF9fZXJyb3InLFxyXG5cdFx0XHRcdHR5cGU6ICdpbmxpbmUnXHJcblx0XHRcdH1cclxuXHRcdF0sXHJcblx0fSk7XHJcblx0JCgnYS5vcGVuX2JpZCcpLm1hZ25pZmljUG9wdXAoe1xyXG5cdFx0aXRlbXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNyYzogJy5wb3B1cF9fYmlkJyxcclxuXHRcdFx0XHR0eXBlOiAnaW5saW5lJ1xyXG5cdFx0XHR9XHJcblx0XHRdLFxyXG5cdH0pO1xyXG5cdCQoJ2Eub3Blbl9jaGVja291dCcpLm1hZ25pZmljUG9wdXAoe1xyXG5cdFx0aXRlbXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNyYzogJy5wb3B1cF9fY2hlY2tvdXQnLFxyXG5cdFx0XHRcdHR5cGU6ICdpbmxpbmUnXHJcblx0XHRcdH1cclxuXHRcdF0sXHJcblx0fSk7XHJcblxyXG5cdCQoJy5wcm9kdWN0X19pbWFnZS1yZXNpemUnKS5tYWduaWZpY1BvcHVwKHtcclxuXHRcdHR5cGUgOiAnaW1hZ2UnLFx0XHRcclxuXHR9KTtcclxufSk7XHJcblxyXG4vL2J1dHRvbnMgZmlsbFxyXG4kKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLmJ1dHRvbiAuYnRuX2ZpbGwnLCBmdW5jdGlvbigpe1xyXG5cdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2ZpbGwnKTtcclxuXHQkKHRoaXMpLm5leHQoJy5idG5fYmxhbmsnKS5hZGRDbGFzcygnZmlsbCcpO1xyXG5cdCQodGhpcykucHJldignLmJ0bl9ibGFuaycpLmFkZENsYXNzKCdmaWxsJyk7XHJcbn0pO1xyXG4kKCdib2R5Jykub24oJ21vdXNlbGVhdmUnLCAnLmJ1dHRvbiAuYnRuX2ZpbGwnLCBmdW5jdGlvbigpe1xyXG5cdCQodGhpcykuYWRkQ2xhc3MoJ2ZpbGwnKTtcclxuXHQkKHRoaXMpLm5leHQoJy5idG5fYmxhbmsnKS5yZW1vdmVDbGFzcygnZmlsbCcpO1xyXG5cdCQodGhpcykucHJldignLmJ0bl9ibGFuaycpLnJlbW92ZUNsYXNzKCdmaWxsJyk7XHJcbn0pO1xyXG4kKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLmJ1dHRvbiAuYnRuX2JsYW5rJywgZnVuY3Rpb24oKXtcclxuXHQkKHRoaXMpLmFkZENsYXNzKCdmaWxsJyk7XHJcblx0JCh0aGlzKS5uZXh0KCcuYnRuX2ZpbGwnKS5yZW1vdmVDbGFzcygnZmlsbCcpO1xyXG5cdCQodGhpcykucHJldignLmJ0bl9maWxsJykucmVtb3ZlQ2xhc3MoJ2ZpbGwnKTtcclxufSk7XHJcbiQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsICcuYnV0dG9uIC5idG5fYmxhbmsnLCBmdW5jdGlvbigpe1xyXG5cdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2ZpbGwnKTtcclxuXHQkKHRoaXMpLm5leHQoJy5idG5fZmlsbCcpLmFkZENsYXNzKCdmaWxsJyk7XHJcblx0JCh0aGlzKS5wcmV2KCcuYnRuX2ZpbGwnKS5hZGRDbGFzcygnZmlsbCcpO1xyXG59KTtcclxuXHJcbiQoJy5pdGVtLXN0YXRzX19mYXZvcml0ZXMsIC5pdGVtLXN0YXRzX19saWtlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0JCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbn0pO1xyXG5cclxuLy9TZWxlY3RcclxuJCgnc2VsZWN0Jykuc3R5bGVyKCk7XHJcblxyXG5cclxuLypfX18qL1xyXG5cclxuLy8gRHJvcGRvd25cclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZmFxX2FydGljbGVfZHJvcGRvd25fbGkgc3BhbicsIGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZSA9ICQodGhpcyksXHJcblx0XHRpbmZvID0gZS5wYXJlbnQoKS5maW5kKCcuZmFxX2FydGljbGVfZHJvcGRvd25faW5mbycpO1xyXG5cclxuXHRcdGlmIChlLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG5cdFx0XHRjbG9zZSgpO1xyXG5cclxuXHRcdFx0ZS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdGluZm8uc2xpZGVVcCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZmFxX2Nsb3NlKCk7XHJcblxyXG5cdFx0XHRlLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0aW5mby5zbGlkZURvd24oKTtcclxuXHRcdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBmYXFfY2xvc2UoKSB7XHJcblx0JCgnLmZhcV9hcnRpY2xlX2Ryb3Bkb3duX2xpIHNwYW4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0JCgnLmZhcV9hcnRpY2xlX2Ryb3Bkb3duX2luZm8nKS5zbGlkZVVwKCk7XHJcbn1cclxuXHJcbi8vIFBsYXkvc3RvcFxyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy52aWRlbycsIGZ1bmN0aW9uKCl7XHJcblx0bGV0IGUgPSAkKHRoaXMpLFxyXG5cdFx0YWN0aXZlID0gZS5oYXNDbGFzcygnc3RvcCcpLFxyXG5cdFx0dmlkZW8gPSBlLmZpbmQoJ3ZpZGVvJyk7XHJcblxyXG5cdGUucmVtb3ZlQ2xhc3MoJ3N0b3AnKTtcclxuXHR2aWRlby5wcm9wKCdjb250cm9scycsIHRydWUpO1xyXG5cdHZpZGVvLmdldCgwKS5wbGF5KCk7IFxyXG5cclxuXHRpZiAoYWN0aXZlID09IGZhbHNlKSB7XHJcblx0XHRlLmFkZENsYXNzKCdzdG9wJyk7XHJcblx0XHR2aWRlby5nZXQoMCkucGF1c2UoKTsgXHJcblx0XHR2aWRlby5wcm9wKCdjb250cm9scycsIGZhbHNlKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy8gQ2FiaW5ldCBuYXZpZ2F0aW9uXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmNhYmluZXRfbmF2X2xpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICQoJy5jYWJpbmV0X25hdl9saScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIGUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG59KTtcclxuXHJcbi8vIENvcHlcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2FiaW5ldF90b3BfdXNlcl9saW5rJywgZnVuY3Rpb24gKCkge1xyXG5cdHZhciBlID0gJCh0aGlzKSxcclxuXHRcdHZhbCA9IGUudGV4dCgpLFxyXG5cdFx0ZiA9ICQoJzxpbnB1dD4nKTtcclxuXHJcblx0ZS50b2dnbGVDbGFzcygnaWNvbi1jb3B5IGljb24tY29weV9maWxsJylcclxuXHJcblx0JCgnYm9keScpLmFwcGVuZChmKTtcclxuXHRmLnZhbCh2YWwpLnNlbGVjdCgpO1xyXG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XHJcblx0Zi5yZW1vdmUoKTtcclxuXHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdGUudG9nZ2xlQ2xhc3MoJ2ljb24tY29weSBpY29uLWNvcHlfZmlsbCcpXHJcblx0fSwgMTAwMCk7XHJcbn0pO1xyXG5cclxuLy8gQ3JlYXRlIGNoZWNrXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0JCgnLmNyZWF0ZV9jaGVjay5pbmFjdGl2ZSAuY3JlYXRlX2NoZWNrX2luZm8nKS5zbGlkZVVwKCk7XHJcbn0pXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmNyZWF0ZV9jaGVjay5pbmFjdGl2ZSBsYWJlbCcsIGZ1bmN0aW9uICgpIHtcclxuXHQkKCcuY3JlYXRlX2NoZWNrLmFjdGl2ZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUgaW5hY3RpdmUnKS5maW5kKCcuY3JlYXRlX2NoZWNrX2luZm8nKS5zbGlkZVVwKCkuZmluZCgnaW5wdXQnKS52YWwoJycpO1xyXG5cdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZSBpbmFjdGl2ZScpLmZpbmQoJy5jcmVhdGVfY2hlY2tfaW5mbycpLnNsaWRlRG93bigpO1xyXG59KVxyXG5cclxuLy8gRGF0YXBpa2VyXHJcblxyXG4kKCBmdW5jdGlvbigpIHtcclxuICAgICQoJy5kYXRlcGlja2VyJykuZGF0ZXBpY2tlcigpO1xyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
