import { JetSlider } from '../components/jet-1.0.0.min'

export default class Party {

    constructor() {
        this.init()
    }

    moveClouds() {
        window.addEventListener("scroll", function() {
            const scrollPosition = window.scrollY;
        
            const cloud1 = document.querySelector('.cream-clouds-2');
            cloud1.style.transform = `translateX(${scrollPosition * 0.6}px)`;
        
            const cloud2 = document.querySelector('.cream-clouds');
            cloud2.style.transform = `translateX(${scrollPosition * 0.3}px)`;
        });
    }

    sliderDecorations() {
        new JetSlider({
            element: '.party-decorations__slider',
            previous: '.party-decorations__pagination-previous',
            next: '.party-decorations__pagination-next',
            pagination: '.party-decorations__pagination',
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

    expandGallery() {
        const buttons = document.querySelectorAll('.party-decorations__slide, .party-decorations__gallery-close')
        
        buttons.forEach(button => {
            button.addEventListener('click', this.expandGalleryHandler.bind(this))
        })
    }

    expandGalleryHandler() {
        const html = document.documentElement
        
        html.classList.toggle('expand')

        this.gallerySlider()
        this.thumbSlider()
    }

    gallerySlider() {
        this['galleryphoto'] = new JetSlider({
            element: '.party-decorations__gallery-slider',
            previous: '.party-decorations__gallery-previous',
            next: '.party-decorations__gallery-next',
            center: true,
            slidesToShow: 1,
            drag: 'free-snap',
            keyboard: true,
            loop: true,
            onChange: current => {
                this['thumbphoto'].goTo(current)
                this.setCounter(current)
            }
        })
    }

    thumbSlider() {
        this['thumbphoto'] = new JetSlider({
            element: '.party-decorations__thumb-slider',
            previous: '.party-decorations__thumb-previous',
            next: '.party-decorations__thumb-next',
            mode: 'thumbs',
            slidesToShow: '160px',
            gap: 30,
            drag: 'free-snap',
            onClick: current => this[`galleryphoto`].goTo(current)
        })
    }

    setCounter(current) {
        const counter = document.querySelector('.party-decorations__gallery-number')

        counter.innerHTML = current + 1
    }

    galleryImageClickHandler(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10)
    
        this.expandGalleryHandler()
    
        setTimeout(() => this.gallerySliderGoTo(index), 50)
    }

    galleryPhoto() {
        const images = document.querySelectorAll('.party-decorations__slide')
    
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


    sliderStructure() {
        new JetSlider({
            element: '.party-structure__slider',
            previous: '.party-structure__pagination-previous',
            next: '.party-structure__pagination-next',
            loop: true,
            pagesToShow: 5,
        })
    }

    sliderToys() {
        new JetSlider({
            element: '.party-toys__slider',
            previous: '.party-toys__pagination-previous',
            next: '.party-toys__pagination-next',
            loop: true,
            pagesToShow: 5,
        })
    }

    sliderFoods() {
        new JetSlider({
            element: '.party-foods__slider',
            previous: '.party-foods__pagination-previous',
            next: '.party-foods__pagination-next',
            loop: true,
            pagesToShow: 5,
        })
    }

    init() {
        this.sliderDecorations()
        this.gallerySlider()
        this.expandGallery()
        this.thumbSlider()
        this.sliderStructure()
        this.sliderToys()
        this.sliderFoods()
    }

}