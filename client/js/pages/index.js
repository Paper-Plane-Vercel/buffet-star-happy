import { JetSlider } from '../components/jet-1.0.0.min'

export default class Index {

    constructor() {
        this.init()
    }

    changeBanner() {
        const slides = document.querySelectorAll('.index-banner__img');
        let currentSlide = 0;
    
        slides[currentSlide].classList.add('active');
    
        setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.remove('active');
            slides[nextSlide].classList.add('active');
            currentSlide = nextSlide;
        }, 5000);
    }

    servicesSlider() {
        new JetSlider({
            element: '.index-services__slider',
            previous: '.index-services__pagination-previous',
            next: '.index-services__pagination-next',
            pagination: '.index-services__pagination',
            loop: true,
            slidesToShow: 5,
            breakpoints: {
                '820': {
                    slidesToShow: 3,
                    slidesToScroll: 2
                },
                '567': {
                    slidesToShow: 1
                }
            },
        })
    }

    sliderEvents() {
        new JetSlider({
            element: '.index-events__slider',
            previous: '.index-events__pagination-previous',
            next: '.index-events__pagination-next',
            pagination: '.index-events__pagination',
            mode: 'thumbs',
            loop: true,
            slidesToShow: '237px',
            slidesToScroll: '237px',
            gap: 30,
            breakpoints: {
                '820': {
                    slidesToShow: '174px',
                    slidesToScroll: '174px'
                },
                '567': {
                    slidesToShow: '143px',
                    slidesToScroll: '143px'
                }
            },
            grid: [
                {
                    grid: 'auto auto / auto',
                    gap: '30px',
                    total: 2
                },
            ],
            onClick: current => this[`galleryphoto`].goTo(current)
        })
    }

    sliderTestimonials() {
        new JetSlider({
            element: '.index-testimonials__slider',
            previous: '.index-testimonials__pagination-previous',
            next: '.index-testimonials__pagination-next',
            pagination: '.index-testimonials__pagination',
            loop: true,
            slidesToShow: '300px',
            slidesToScroll: '300px'
        })
    }

    expandGallery() {
        const buttons = document.querySelectorAll('.index-events__slide, .index-events__gallery-close')
        
        buttons.forEach(button => {
            button.addEventListener('click', this.expandGalleryHandler.bind(this))
        })
    }

    expandGalleryHandler() {
        const html = document.documentElement
        
        html.classList.toggle('expand')

        // this.gallerySlider()
        // this.thumbSlider()
    }

    gallerySlider() {
        this['galleryphoto'] = new JetSlider({
            element: '.index-events__gallery-slider',
            previous: '.index-events__gallery-previous',
            next: '.index-events__gallery-next',
            center: true,
            slidesToShow: 1,
            drag: 'free-snap',
            keyboard: true,
            loop: true,
            // startIndex: this.galleryIndex || 0,
            onChange: current => {
                this['thumbphoto'].goTo(current)
                this.setCounter(current)
            }
        })
    }

    thumbSlider() {
        this['thumbphoto'] = new JetSlider({
            element: '.index-events__thumb-slider',
            previous: '.index-events__thumb-previous',
            next: '.index-events__thumb-next',
            mode: 'thumbs',
            slidesToShow: '160px',
            gap: 30,
            drag: 'free-snap',
            loop: true,
            // startIndex: this.galleryIndex || 0,
            onClick: current => this[`galleryphoto`].goTo(current)
        })
    }

    setCounter(current) {
        const counter = document.querySelector('.index-events__gallery-number')

        counter.innerHTML = current + 1
    }

    galleryImageClickHandler(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10)
    
        this.expandGalleryHandler()
    
        setTimeout(() => this.gallerySliderGoTo(index), 50)
    }

    galleryPhoto() {
        const images = document.querySelectorAll('.index-events__slide')
    
        images.forEach(image => {
            image.addEventListener('click', this.galleryImageClickHandler.bind(this))
        })
    }

    gallerySliderGoTo(index) {
        if (this.galleryphoto) {
            this.galleryphoto.goTo(index)
        }

        if (this.thumbphoto) {
            this.thumbphoto.goTo(index)
        }
    }

    init() {
        this.changeBanner()
        this.servicesSlider()
        this.sliderEvents()
        this.sliderTestimonials()
        this.gallerySlider()
        this.expandGallery()
        this.thumbSlider()
    }

}