
import React, { useState, useEffect } from 'react'
import { Button, Navbar, Dropdown, Menu,  } from 'react-daisyui'
import { Link, json } from 'react-router-dom';
import renderAlert from './shared/renderAlert';
import { useAppContext } from '../services/context';
import { 
  ConnectWallet, 
  useAddress,
  useDisconnect
} from "@thirdweb-dev/react";
import { useUser } from '../hooks/useUser';

const Navigation = () => {
    const { state, dispatch } = useAppContext();
    const disconnect = useDisconnect()
    const { user, logout, isUserLoading, isUserError, isLoggedIn } = useUser();
    const address = useAddress();

    useEffect( () => {
      if (address) {
        dispatch({ type: 'SET_CONNECTED_WALLET', payload: address })
      }

      if (!address) {
        dispatch({ type: 'LOGOUT' })
        dispatch({ type: 'DISCONNECT_WALLET' })
      }

      if (address && user) {
        dispatch({ type: 'LOGIN', payload: { user: user } })
      }
    }, [address, user])

    const onLogout = async () => {
      await logout()
      await disconnect()
      dispatch({ type: 'LOGOUT' });
    }

    return (
      <div className='container flex mx-auto'>
        <Navbar>
          <Navbar.Start className='space-x-2'>
          { address && (
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
            
              <Menu horizontal className="px-2 flex items-center gap-x-2">
                <li>
                  <Link as='Menu.Item' to={'/collections'}>Collections</Link>
                </li>
              </Menu>
            
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
            { state.isLoggedIn && (
              <Menu horizontal className="px-2 flex items-center gap-x-2">
                <li className='hidden lg:flex'>
                  <Link as='Menu.Item' to={'/inbox'}>Inbox</Link>
                </li>
                <li className='hidden lg:flex'>
                  <Link as='Menu.Item' to={'/settings'}>Settings</Link>
                </li>
              </Menu>
            )}
            { state.isLoggedIn && (
              <Button onClick={onLogout} color="ghost">Logout</Button>
            )}
            { !state.isLoggedIn && (
              <ConnectWallet
                showThirdwebBranding={false}
                detailsBtn={() => {
                  return <button>dm'ing from {address}</button>;
                }}
                auth={{
                  loginOptional: false,
                }}
                connectModal={{
                  title: 'Connect Wallet',
                  description: 'Connect your wallet to use gmdm',              
                }}
                
                onConnect={(wallet) => { 
                  if (wallet?.account?.address) {
                    dispatch({ type: 'SET_CONNECTED_WALLET', payload: wallet?.account?.address })
                  }
                }}
                onDisconnect={() => { 
                  dispatch({ type: 'DISCONNECT_WALLET' })
                }}
              />
            )}
          </Navbar.End>
        </Navbar>
      </div>
    )
}

export default Navigation