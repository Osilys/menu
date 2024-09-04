import {useState, useEffect} from 'react'

const getOrientation = () =>
  window.screen.orientation.type

const useScreenOrientation = () => {
  const [orientation, setOrientation] =
    useState(getOrientation())

  const updateOrientation = event => {
    setOrientation(getOrientation())
  }

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      updateOrientation
    )
    return () => {
      window.removeEventListener(
        'orientationchange',
        updateOrientation
      )
    }
  }, [])

  return orientation;
};

function Rota() {    
    const orientation = useScreenOrientation();
    if (orientation !== "portrait-primary" && window.screen.width <= 767) {
        return (
            <div className='paysage'>
                <h1>Tournez votre écran</h1>
            </div>
        )
    }
};

export default Rota;
