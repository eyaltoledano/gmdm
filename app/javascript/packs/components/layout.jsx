
import React from 'react'

function Layout(props) {
  return (
    <html>
      <header>
        <title>gmdm</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </header>
      <main>
        <div id='main'>
          <div className="border-b border-gray-200 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <a href="/" className="text-lg font-semibold text-gray-900">gmdm</a>
                  <ul className="flex ml-8 space-x-8">
                    <li><a href="/messages" className="text-gray-600 hover:text-gray-900">Inbox</a></li>
                  </ul>
                </div>
                <div className="flex items-center">
                  {/* rainbowkit wallet connect */}
                  
                </div>
              </div>
            </div>
          </div>
          {props.children}
        </div>
      </main>
      <footer>
        <div className="container mx-auto px-4">
          <div className="py-12 text-center text-gray-400 text-sm">
            <p>© 2024 gmdm. built with love by sh0</p>
          </div>
        </div>
      </footer>
    </html>
  )
}

export default Layout