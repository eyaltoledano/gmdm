# == Route Map
#

Rails.application.routes.draw do
  # API Routes
  namespace :api do
    namespace :v1 do
      # SIWE Auth Routes
      resources :users, only: [:index, :create, :show, :update, :destroy]
      resources :collections, only: [:index, :create, :show, :update, :destroy], param: :slug do
        resources :nfts, only: [:index, :create, :show, :update, :destroy] # nft param needs to be the nft id so we end up with /doodles/1234
      end
      resources :dms, only: [:index, :create, :show, :update, :destroy]
      resources :messages, only: [:index, :create, :show, :update, :destroy]
    end
  end

  # get '/auth/thirdweb', to: 'auth#payload'
  post '/auth/payload', to: 'auth#payload'
  post '/auth/login', to: 'auth#login'
  get '/auth/user', to: 'auth#user'
  post '/auth/logout', to: 'auth#logout'

  # Catchall route for React Router
  # This sends non-API requests to your React app, allowing React Router to handle routing
  get '*path', to: 'frontend#app', constraints: ->(request) do
    !request.xhr? && request.format.html? && !request.path.start_with?('/api/')
  end
  root to: 'frontend#app'
end
