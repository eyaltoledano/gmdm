# == Route Map
#

Rails.application.routes.draw do
  # API Routes
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
      resources :collections, only: [:index, :create, :show, :update, :destroy], param: :slug do
        member do
          get ':token_id', to: 'nfts#show', as: :nft
        end
        resources :nfts, only: [:index, :create, :show, :update, :destroy] # nft param needs to be the nft id so we end up with /doodles/1234
      end
      resources :dms, only: [:index, :create, :show, :update, :destroy] do
        resources :messages, only: [:index, :create, :show, :update, :destroy]
      end
    end
  end

  post '/auth/payload', to: 'auth#payload'
  post '/auth/login', to: 'auth#login'
  get '/auth/user', to: 'auth#user'
  post '/auth/logout', to: 'auth#logout'

  # Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'

  # Catchall route for React Router
  # This sends non-API requests to your React app, allowing React Router to handle routing
  get '*path', to: 'frontend#app', constraints: ->(request) do
    !request.xhr? && request.format.html? && !request.path.start_with?('/api/')
  end
  root to: 'frontend#app'
end
