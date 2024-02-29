# == Route Map
#

Rails.application.routes.draw do
  # API Routes
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
      resources :collections, only: [:index, :create, :show, :update, :destroy], param: :slug do
        resources :nfts, only: [:index, :create, :show, :update, :destroy] # nft param needs to be the nft id so we end up with /doodles/1234
      end
      resources :dms, only: [:index, :create, :show, :update, :destroy]
      resources :messages, only: [:index, :create, :show, :update, :destroy]
    end
  end

  # SIWE Routes
  get '/nonce', to: 'siwe#nonce'
  post '/verify', to: 'siwe#verify'

  # Catchall route for React Router
  # This sends non-API requests to your React app, allowing React Router to handle routing
  get '*path', to: 'frontend#app', constraints: ->(request) { !request.xhr? && request.format.html? }
  root to: 'frontend#app'
end
