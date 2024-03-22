
import React from 'react'
import Navigation from './navigation';

function Layout(props) {
  return (
    <>
      <header>
        <title>gmdm</title>
      </header>
      <main>
        <div id='main'>
          <Navigation />
          {props.children}
        </div>
      </main>
      <footer>
        <div className="container mx-auto px-4">
          <div className="py-2 text-center text-gray-400 text-sm">
            <p>© saying gm in yours dms since 2024</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Layout