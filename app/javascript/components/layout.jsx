
import React from 'react'
import { useAppContext } from '../services/context'
import Navigation from './navigation';

function Layout(props) {
  const { state, dispatch } = useAppContext();
  return (
    <>
      <header>
        <title>gmdm</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </header>
      <main>
        <div id='main'>
          <Navigation />
          {props.children}
        </div>
      </main>
      <footer>
        <div className="container mx-auto px-4">
          <div className="py-12 text-center text-gray-400 text-sm">
            <p>© 2024 gmdm</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Layout