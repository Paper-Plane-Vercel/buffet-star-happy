import { JetSlider } from '../components/jet-1.0.0.min'

export default class Franchise {

    constructor() {
        this.init()
    }

    slider1() {
        new JetSlider({
            element: '.franchise-advantages__slider1',
            previous: '.franchise-advantages__pagination-previous1',
            next: '.franchise-advantages__pagination-next1',
            pagination: '.franchise-advantages__pagination1',
            loop: true,
            slidesToShow: 6,
            slidesToScroll: 6,
            breakpoints: {
                '1080': {
                    slidesToShow: 3,
                    slidesToScroll: 3
                },
                '820': {
                    slidesToShow: 2,
                    slidesToScroll: 2
                },
                '567': {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        })
    }

    slider2() {
        new JetSlider({
            element: '.franchise-advantages__slider2',
            previous: '.franchise-advantages__pagination-previous2',
            next: '.franchise-advantages__pagination-next2',
            pagination: '.franchise-advantages__pagination2',
            loop: true,
            slidesToShow: 6,
            slidesToScroll: 6,
            breakpoints: {
                '1080': {
                    slidesToShow: 3,
                    slidesToScroll: 3
                },
                '820': {
                    slidesToShow: 2,
                    slidesToScroll: 2
                },
                '567': {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        })
    }

    init() {
        this.slider1()
        this.slider2()
    }

}