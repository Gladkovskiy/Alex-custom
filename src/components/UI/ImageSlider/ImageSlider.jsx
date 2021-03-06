import React from 'react'
import classes from './ImageSlider.module.sass'
import 'react-slideshow-image/dist/styles.css'
import {Slide} from 'react-slideshow-image'

const ImageSlider = ({
  width,
  height,
  slideItem,
  duration = 3000,
  arrows = true,
  pauseOnHover = true,
  easing = 'ease',
  transitionDuration = 1000,
}) => {
  return (
    <div style={{width}} className={classes.ImageSlider}>
      <Slide
        easing="easing"
        indicators={false}
        duration={duration}
        arrows={arrows}
        pauseOnHover={pauseOnHover}
        transitionDuration={transitionDuration}
      >
        {slideItem.map((item, index) => (
          <div className={classes.eachSlide} key={index + 's'}>
            <div style={{backgroundImage: `url(${item})`, height}} />
          </div>
        ))}
      </Slide>
    </div>
  )
}

export default ImageSlider
