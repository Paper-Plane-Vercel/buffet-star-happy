// import { JetTurbo } from '../components/jet-1.0.0.min'

import Header from '../includes/header'
import Main from '../includes/main'

import Animation from './animation'
import Navigation from './navigation'

export default class Global {

    static onLoad() {
        // new JetTurbo({ fallback: false })
        // new Header()
    }

    static onChangeState() {
        new Header()
        new Main()
        new Animation()
        new Navigation()
    }

}