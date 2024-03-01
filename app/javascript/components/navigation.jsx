
import React, { useState, useEffect } from 'react'
import { Button, Navbar, Dropdown, Menu,  } from 'react-daisyui'
import { Link, json } from 'react-router-dom';
import renderAlert from './shared/renderAlert';
import { useAppContext } from '../services/context';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';

const Navigation = () => {
    const { dispatch } = useAppContext();
    const activeAccount = useActiveAccount();

    return (
      <div className='container flex mx-auto'>
        <Navbar>
          <Navbar.Start>
          { true && (
              <Dropdown>
                <Button tag="label" color="ghost" tabIndex={0} className="lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </Button>
                <Dropdown.Menu tabIndex={0} className="w-52 menu-sm mt-3 z-[1]"  as='div'>
                  {/* <li>
                    <a>Collections</a>
                    <ul className="p-2">
                      {collections?.map((collection) => (
                        <li key={collection.slug}>
                          <Link to={`/collections/${collection.slug}`}>{collection.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </li> */}
                      <li><Link to={'/inbox'}>Inbox</Link></li>
                      <li><Link to={'/settings'}>Settings</Link></li>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Link to={'/'} className='btn btn-primary normal-case text-xl'>gmdm</Link>
            { true && (
              <Menu horizontal className="px-2 flex items-center gap-x-2">
                <li className='hidden lg:flex'>
                  <Link as='Menu.Item' to={'/inbox'}>Inbox</Link>
                </li>
              </Menu>
            )}
          </Navbar.Start>
          {/* <Navbar.Center className="hidden lg:flex">
            <Menu horizontal className="px-1 container gap-x-1">
              <Menu.Item as='div'>
                <details>
                  <summary>Collections</summary>
                  <ul className="p-2 mt-0">
                    {collections?.map((collection) => (
                      <Menu.Item key={collection.slug} as='div'> 
                        <Link to={`/collections/${collection.slug}`}>{collection.name}</Link>
                      </Menu.Item>
                    ))}
                  </ul>
                </details>
              </Menu.Item>
            </Menu>
          </Navbar.Center> */}
          <Navbar.End>
            { true && (
              <Menu horizontal className="px-2 flex items-center gap-x-2">
                <li className='hidden lg:flex'>
                  <Link as='Menu.Item' to={'/settings'}>Settings</Link>
                </li>
              </Menu>
            )}
            <ConnectButton
              connectModal={{
                title: 'Connect Wallet',
                description: 'Connect your wallet to use gmdm',              
              }}
              onConnect={(data) => {
                if (data?.address) {
                  dispatch({ type: 'SET_CONNECT_WALLET', payload: data?.address });              
                }
              }}
              onDisconnect={() => {
                dispatch({ type: 'DISCONNECT_WALLET' });
              }}
            />
          </Navbar.End>
        </Navbar>
      </div>
    )
}

export default Navigation